using UnityEngine;
using Unity.Netcode;
using UnityEngine.InputSystem;

/// <summary>
/// Aerial Movement System - 6 Degrees of Freedom Flight
/// Handles player movement in 3D space with boost, dash, and arcade-style physics
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class AerialMovement : NetworkBehaviour
{
    [Header("Movement Settings")]
    [SerializeField] private float flySpeed = 20f;
    [SerializeField] private float boostSpeed = 35f;
    [SerializeField] private float rotationSpeed = 180f;
    [SerializeField] private float lookSensitivity = 2f;

    [Header("Dash Settings")]
    [SerializeField] private float dashForce = 50f;
    [SerializeField] private float dashCooldown = 3f;
    [SerializeField] private float dashDuration = 0.2f;

    [Header("Boost Settings")]
    [SerializeField] private float maxBoostEnergy = 100f;
    [SerializeField] private float boostConsumptionRate = 10f;
    [SerializeField] private float boostRegenRate = 5f;
    [SerializeField] private float boostRegenDelay = 5f;

    [Header("Physics Settings")]
    [SerializeField] private float gravity = -15f;
    [SerializeField] private float drag = 0.5f;
    [SerializeField] private float lift = 0.3f;

    [Header("Tilt Settings")]
    [SerializeField] private float tiltAmount = 15f;
    [SerializeField] private float tiltSpeed = 5f;

    [Header("References")]
    [SerializeField] private Transform cameraTransform;
    [SerializeField] private Animator animator;

    // Components
    private CharacterController _controller;

    // Input
    private Vector2 _movementInput;
    private Vector2 _lookInput;
    private bool _boostInput;
    private bool _dashInput;

    // Movement State
    private Vector3 _velocity;
    private Vector3 _movement;
    private float _currentSpeed;

    // Rotation State
    private float _pitch;
    private float _yaw;
    private float _currentTilt;

    // Dash State
    private bool _isDashing;
    private float _lastDashTime = -999f;
    private float _dashEndTime;

    // Boost State
    private float _currentBoostEnergy;
    private float _lastBoostUseTime;

    // Network Variables
    private NetworkVariable<Vector3> _networkPosition = new NetworkVariable<Vector3>();
    private NetworkVariable<Quaternion> _networkRotation = new NetworkVariable<Quaternion>();

    #region Unity Callbacks

    private void Awake()
    {
        _controller = GetComponent<CharacterController>();
        _currentBoostEnergy = maxBoostEnergy;

        // Find camera if not assigned
        if (cameraTransform == null)
        {
            cameraTransform = Camera.main?.transform;
        }
    }

    private void Update()
    {
        if (!IsOwner) return;

        HandleRotation();
        HandleMovement();
        HandleDash();
        HandleBoost();
        UpdateAnimations();
    }

    private void FixedUpdate()
    {
        if (!IsOwner) return;

        ApplyPhysics();
    }

    #endregion

    #region Input Handling

    public void OnMove(InputValue value)
    {
        _movementInput = value.Get<Vector2>();
    }

    public void OnLook(InputValue value)
    {
        _lookInput = value.Get<Vector2>();
    }

    public void OnBoost(InputValue value)
    {
        _boostInput = value.isPressed;
    }

    public void OnDash(InputValue value)
    {
        if (value.isPressed)
        {
            _dashInput = true;
        }
    }

    #endregion

    #region Movement Logic

    private void HandleMovement()
    {
        // Calculate target speed based on boost
        float targetSpeed = _boostInput && CanBoost() ? boostSpeed : flySpeed;
        _currentSpeed = Mathf.Lerp(_currentSpeed, targetSpeed, Time.deltaTime * 5f);

        // Get camera-relative movement direction
        Vector3 forward = cameraTransform ? cameraTransform.forward : transform.forward;
        Vector3 right = cameraTransform ? cameraTransform.right : transform.right;

        // Remove vertical component for horizontal movement
        forward.y = 0f;
        right.y = 0f;
        forward.Normalize();
        right.Normalize();

        // Calculate movement direction
        Vector3 moveDirection = (forward * _movementInput.y + right * _movementInput.x).normalized;

        // Add vertical movement (space for up, could add another input for down)
        if (Input.GetKey(KeyCode.Space) && !_isDashing)
        {
            moveDirection.y = 1f;
        }
        else if (Input.GetKey(KeyCode.LeftControl))
        {
            moveDirection.y = -1f;
        }

        // Apply movement
        _movement = moveDirection * _currentSpeed;
    }

    private void HandleRotation()
    {
        // Rotate based on look input
        _yaw += _lookInput.x * lookSensitivity;
        _pitch -= _lookInput.y * lookSensitivity;
        _pitch = Mathf.Clamp(_pitch, -89f, 89f);

        // Calculate tilt based on horizontal movement
        float targetTilt = -_movementInput.x * tiltAmount;
        _currentTilt = Mathf.Lerp(_currentTilt, targetTilt, Time.deltaTime * tiltSpeed);

        // Apply rotation
        Quaternion targetRotation = Quaternion.Euler(_pitch, _yaw, _currentTilt);
        transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * rotationSpeed);
    }

    private void ApplyPhysics()
    {
        // Apply gravity
        _velocity.y += gravity * Time.fixedDeltaTime;

        // Apply drag
        _velocity *= (1f - drag * Time.fixedDeltaTime);

        // Add movement to velocity
        _velocity += _movement * Time.fixedDeltaTime;

        // Apply lift (opposes gravity when moving)
        if (_movement.magnitude > 0.1f)
        {
            _velocity.y += lift * _movement.magnitude * Time.fixedDeltaTime;
        }

        // Move character
        _controller.Move(_velocity * Time.fixedDeltaTime);

        // Sync position over network
        if (IsServer)
        {
            _networkPosition.Value = transform.position;
            _networkRotation.Value = transform.rotation;
        }
    }

    private void HandleDash()
    {
        if (!_dashInput) return;
        _dashInput = false;

        // Check cooldown
        if (Time.time - _lastDashTime < dashCooldown) return;

        // Execute dash
        Vector3 dashDirection = transform.forward;
        _velocity = dashDirection * dashForce;

        _isDashing = true;
        _lastDashTime = Time.time;
        _dashEndTime = Time.time + dashDuration;

        // Trigger dash animation
        if (animator != null)
        {
            animator.SetTrigger("Dash");
        }

        // Play dash effect
        PlayDashEffectServerRpc();
    }

    private void HandleBoost()
    {
        if (_boostInput && CanBoost())
        {
            // Consume boost energy
            _currentBoostEnergy -= boostConsumptionRate * Time.deltaTime;
            _currentBoostEnergy = Mathf.Max(_currentBoostEnergy, 0f);
            _lastBoostUseTime = Time.time;
        }
        else
        {
            // Regenerate boost energy after delay
            if (Time.time - _lastBoostUseTime > boostRegenDelay)
            {
                _currentBoostEnergy += boostRegenRate * Time.deltaTime;
                _currentBoostEnergy = Mathf.Min(_currentBoostEnergy, maxBoostEnergy);
            }
        }

        // End dash after duration
        if (_isDashing && Time.time >= _dashEndTime)
        {
            _isDashing = false;
        }
    }

    private bool CanBoost()
    {
        return _currentBoostEnergy > 0f && !_isDashing;
    }

    #endregion

    #region Animations

    private void UpdateAnimations()
    {
        if (animator == null) return;

        animator.SetFloat("Speed", _currentSpeed);
        animator.SetFloat("HorizontalSpeed", _movementInput.magnitude);
        animator.SetBool("IsBoosting", _boostInput && CanBoost());
        animator.SetBool("IsDashing", _isDashing);
    }

    #endregion

    #region Network RPCs

    [ServerRpc]
    private void PlayDashEffectServerRpc()
    {
        PlayDashEffectClientRpc();
    }

    [ClientRpc]
    private void PlayDashEffectClientRpc()
    {
        // Play dash VFX and SFX here
        // TODO: Add particle effect and sound
        Debug.Log("Dash effect played!");
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Get current boost energy percentage (0-1)
    /// </summary>
    public float GetBoostEnergyPercent()
    {
        return _currentBoostEnergy / maxBoostEnergy;
    }

    /// <summary>
    /// Get dash cooldown remaining in seconds
    /// </summary>
    public float GetDashCooldownRemaining()
    {
        float remaining = dashCooldown - (Time.time - _lastDashTime);
        return Mathf.Max(remaining, 0f);
    }

    /// <summary>
    /// Check if currently dashing
    /// </summary>
    public bool IsDashing()
    {
        return _isDashing;
    }

    /// <summary>
    /// Force stop movement (for death, stun, etc.)
    /// </summary>
    public void StopMovement()
    {
        _velocity = Vector3.zero;
        _movement = Vector3.zero;
        _currentSpeed = 0f;
    }

    #endregion

    #region Network Synchronization

    public override void OnNetworkSpawn()
    {
        if (!IsOwner)
        {
            // Non-owner clients interpolate position
            enabled = false; // Disable Update for non-owners
        }
    }

    #endregion
}
