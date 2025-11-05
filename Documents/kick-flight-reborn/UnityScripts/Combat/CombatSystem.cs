using UnityEngine;
using Unity.Netcode;
using UnityEngine.InputSystem;
using System.Collections;

/// <summary>
/// Combat System - Handles kicks, combos, and special attacks
/// Includes network synchronization for multiplayer combat
/// </summary>
public class CombatSystem : NetworkBehaviour
{
    [Header("Kick Settings")]
    [SerializeField] private int kickDamage = 25;
    [SerializeField] private float kickRange = 3f;
    [SerializeField] private float kickCooldown = 0.5f;
    [SerializeField] private float kickRadius = 1.5f;

    [Header("Special Attack Settings")]
    [SerializeField] private int specialDamage = 50;
    [SerializeField] private float specialRange = 5f;
    [SerializeField] private float specialCooldown = 10f;
    [SerializeField] private float specialRadius = 2.5f;

    [Header("Combo Settings")]
    [SerializeField] private int maxComboCount = 3;
    [SerializeField] private float comboWindow = 1.5f;
    [SerializeField] private float comboDamageMultiplier = 1.5f;

    [Header("Knockback Settings")]
    [SerializeField] private float knockbackForce = 5f;
    [SerializeField] private float hitstunDuration = 0.3f;

    [Header("Effects")]
    [SerializeField] private GameObject kickVFX;
    [SerializeField] private GameObject specialVFX;
    [SerializeField] private AudioClip kickSFX;
    [SerializeField] private AudioClip specialSFX;
    [SerializeField] private AudioClip comboSFX;

    [Header("Layers")]
    [SerializeField] private LayerMask targetLayer;

    // Components
    private AerialMovement _movement;
    private AudioSource _audioSource;

    // Combat State
    private float _lastKickTime = -999f;
    private float _lastSpecialTime = -999f;
    private float _lastComboTime;
    private int _currentComboCount;
    private bool _canAttack = true;

    // Network Variables
    private NetworkVariable<int> _networkComboCount = new NetworkVariable<int>();

    #region Unity Callbacks

    private void Awake()
    {
        _movement = GetComponent<AerialMovement>();
        _audioSource = GetComponent<AudioSource>();

        if (_audioSource == null)
        {
            _audioSource = gameObject.AddComponent<AudioSource>();
        }
    }

    #endregion

    #region Input Handling

    public void OnKick(InputValue value)
    {
        if (!IsOwner) return;

        if (value.isPressed && CanKick())
        {
            PerformKick();
        }
    }

    public void OnAbility1(InputValue value)
    {
        if (!IsOwner) return;

        if (value.isPressed && CanUseSpecial())
        {
            PerformSpecialAttack();
        }
    }

    #endregion

    #region Combat Logic

    private bool CanKick()
    {
        return _canAttack && Time.time - _lastKickTime >= kickCooldown;
    }

    private bool CanUseSpecial()
    {
        return _canAttack && Time.time - _lastSpecialTime >= specialCooldown;
    }

    private void PerformKick()
    {
        _lastKickTime = Time.time;

        // Check combo
        if (Time.time - _lastComboTime <= comboWindow && _currentComboCount < maxComboCount)
        {
            _currentComboCount++;
        }
        else
        {
            _currentComboCount = 1;
        }

        _lastComboTime = Time.time;

        // Calculate damage with combo multiplier
        int finalDamage = kickDamage;
        if (_currentComboCount > 1)
        {
            finalDamage = Mathf.RoundToInt(kickDamage * Mathf.Pow(comboDamageMultiplier, _currentComboCount - 1));
        }

        // Request attack on server
        RequestKickServerRpc(transform.position, transform.forward, finalDamage, _currentComboCount);

        // Play local feedback immediately
        PlayKickFeedback(_currentComboCount);
    }

    private void PerformSpecialAttack()
    {
        _lastSpecialTime = Time.time;

        // Request special attack on server
        RequestSpecialAttackServerRpc(transform.position, transform.forward);

        // Play local feedback
        PlaySpecialFeedback();
    }

    private void PlayKickFeedback(int comboCount)
    {
        // Play animation
        // TODO: Add animator trigger

        // Play sound
        if (_audioSource != null)
        {
            if (comboCount > 1 && comboSFX != null)
            {
                _audioSource.PlayOneShot(comboSFX);
            }
            else if (kickSFX != null)
            {
                _audioSource.PlayOneShot(kickSFX);
            }
        }
    }

    private void PlaySpecialFeedback()
    {
        // Play animation
        // TODO: Add animator trigger

        // Play sound
        if (_audioSource != null && specialSFX != null)
        {
            _audioSource.PlayOneShot(specialSFX);
        }
    }

    #endregion

    #region Hit Detection

    private void DetectHits(Vector3 origin, Vector3 direction, float range, float radius, int damage, bool isSpecial)
    {
        // Perform sphere cast to detect hits
        RaycastHit[] hits = Physics.SphereCastAll(origin, radius, direction, range, targetLayer);

        foreach (RaycastHit hit in hits)
        {
            // Don't hit self
            if (hit.transform == transform) continue;

            // Get health component
            KickerHealth targetHealth = hit.transform.GetComponent<KickerHealth>();
            if (targetHealth != null)
            {
                // Apply damage
                targetHealth.TakeDamage(damage);

                // Apply knockback
                Vector3 knockbackDirection = (hit.transform.position - transform.position).normalized;
                ApplyKnockback(hit.transform, knockbackDirection);

                // Spawn hit effect at hit point
                SpawnHitEffectClientRpc(hit.point, isSpecial);
            }
        }
    }

    private void ApplyKnockback(Transform target, Vector3 direction)
    {
        // Try to get movement component to apply knockback
        AerialMovement targetMovement = target.GetComponent<AerialMovement>();
        if (targetMovement != null)
        {
            // Apply knockback via RPC
            ApplyKnockbackClientRpc(target.GetComponent<NetworkObject>().NetworkObjectId, direction * knockbackForce);
        }

        // Apply hitstun
        StartCoroutine(ApplyHitstun(target));
    }

    private IEnumerator ApplyHitstun(Transform target)
    {
        // Disable target's attack ability
        CombatSystem targetCombat = target.GetComponent<CombatSystem>();
        if (targetCombat != null)
        {
            targetCombat._canAttack = false;
            yield return new WaitForSeconds(hitstunDuration);
            targetCombat._canAttack = true;
        }
    }

    #endregion

    #region Combo Management

    private void Update()
    {
        // Reset combo if window expired
        if (Time.time - _lastComboTime > comboWindow && _currentComboCount > 0)
        {
            ResetCombo();
        }

        // Sync combo count
        if (IsServer)
        {
            _networkComboCount.Value = _currentComboCount;
        }
    }

    private void ResetCombo()
    {
        _currentComboCount = 0;
        if (IsServer)
        {
            _networkComboCount.Value = 0;
        }
    }

    #endregion

    #region Network RPCs

    [ServerRpc]
    private void RequestKickServerRpc(Vector3 origin, Vector3 direction, int damage, int comboCount)
    {
        // Validate on server
        if (Time.time - _lastKickTime < kickCooldown * 0.8f) // Allow slight client-server time difference
        {
            return;
        }

        // Perform hit detection on server (authoritative)
        DetectHits(origin, direction, kickRange, kickRadius, damage, false);

        // Broadcast effect to all clients
        PlayKickEffectClientRpc(origin, direction, comboCount);
    }

    [ServerRpc]
    private void RequestSpecialAttackServerRpc(Vector3 origin, Vector3 direction)
    {
        // Validate on server
        if (Time.time - _lastSpecialTime < specialCooldown * 0.8f)
        {
            return;
        }

        // Perform hit detection on server
        DetectHits(origin, direction, specialRange, specialRadius, specialDamage, true);

        // Broadcast effect to all clients
        PlaySpecialEffectClientRpc(origin, direction);
    }

    [ClientRpc]
    private void PlayKickEffectClientRpc(Vector3 origin, Vector3 direction, int comboCount)
    {
        // Spawn kick VFX
        if (kickVFX != null)
        {
            Vector3 effectPosition = origin + direction * (kickRange * 0.5f);
            Quaternion effectRotation = Quaternion.LookRotation(direction);
            GameObject effect = Instantiate(kickVFX, effectPosition, effectRotation);
            Destroy(effect, 2f);
        }
    }

    [ClientRpc]
    private void PlaySpecialEffectClientRpc(Vector3 origin, Vector3 direction)
    {
        // Spawn special VFX
        if (specialVFX != null)
        {
            Vector3 effectPosition = origin + direction * (specialRange * 0.5f);
            Quaternion effectRotation = Quaternion.LookRotation(direction);
            GameObject effect = Instantiate(specialVFX, effectPosition, effectRotation);
            Destroy(effect, 3f);
        }
    }

    [ClientRpc]
    private void SpawnHitEffectClientRpc(Vector3 position, bool isSpecial)
    {
        // Spawn hit VFX at impact point
        // TODO: Add hit particle effect
        Debug.Log($"Hit at {position}! Special: {isSpecial}");
    }

    [ClientRpc]
    private void ApplyKnockbackClientRpc(ulong targetNetworkId, Vector3 knockbackVelocity)
    {
        // Find target by network ID
        NetworkObject targetObject = NetworkManager.Singleton.SpawnManager.SpawnedObjects[targetNetworkId];
        if (targetObject != null)
        {
            AerialMovement targetMovement = targetObject.GetComponent<AerialMovement>();
            if (targetMovement != null)
            {
                // Apply knockback force
                // TODO: Add method to AerialMovement to apply external force
                Debug.Log($"Applying knockback: {knockbackVelocity}");
            }
        }
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Get current combo count
    /// </summary>
    public int GetComboCount()
    {
        return IsOwner ? _currentComboCount : _networkComboCount.Value;
    }

    /// <summary>
    /// Get kick cooldown remaining in seconds
    /// </summary>
    public float GetKickCooldownRemaining()
    {
        float remaining = kickCooldown - (Time.time - _lastKickTime);
        return Mathf.Max(remaining, 0f);
    }

    /// <summary>
    /// Get special cooldown remaining in seconds
    /// </summary>
    public float GetSpecialCooldownRemaining()
    {
        float remaining = specialCooldown - (Time.time - _lastSpecialTime);
        return Mathf.Max(remaining, 0f);
    }

    /// <summary>
    /// Check if can currently attack
    /// </summary>
    public bool CanAttack()
    {
        return _canAttack;
    }

    #endregion

    #region Debug

    private void OnDrawGizmos()
    {
        // Draw kick range in editor
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position + transform.forward * kickRange, kickRadius);

        // Draw special range
        Gizmos.color = Color.blue;
        Gizmos.DrawWireSphere(transform.position + transform.forward * specialRange, specialRadius);
    }

    #endregion
}
