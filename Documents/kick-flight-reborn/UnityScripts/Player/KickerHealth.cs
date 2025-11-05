using UnityEngine;
using Unity.Netcode;
using System;
using System.Collections;

/// <summary>
/// Health System - Manages player health, shield, damage, death, and respawn
/// Fully networked with server authority
/// </summary>
public class KickerHealth : NetworkBehaviour
{
    [Header("Health Settings")]
    [SerializeField] private int maxHealth = 100;
    [SerializeField] private int maxShield = 50;

    [Header("Respawn Settings")]
    [SerializeField] private float respawnDelay = 3f;
    [SerializeField] private float invulnerabilityDuration = 2f;

    [Header("Shield Regeneration")]
    [SerializeField] private bool hasShield = true;
    [SerializeField] private float shieldRegenDelay = 5f;
    [SerializeField] private float shieldRegenRate = 10f;

    [Header("Effects")]
    [SerializeField] private GameObject damageFX;
    [SerializeField] private GameObject deathFX;
    [SerializeField] private GameObject healFX;
    [SerializeField] private GameObject spawnFX;

    [Header("Audio")]
    [SerializeField] private AudioClip damageSound;
    [SerializeField] private AudioClip deathSound;
    [SerializeField] private AudioClip healSound;
    [SerializeField] private AudioClip shieldBreakSound;

    // Network Variables
    private NetworkVariable<int> _health = new NetworkVariable<int>();
    private NetworkVariable<int> _shield = new NetworkVariable<int>();
    private NetworkVariable<bool> _isAlive = new NetworkVariable<bool>(true);
    private NetworkVariable<bool> _isInvulnerable = new NetworkVariable<bool>();

    // Components
    private AerialMovement _movement;
    private CombatSystem _combat;
    private AudioSource _audioSource;

    // State
    private float _lastDamageTime;
    private bool _isRegeneratingShield;

    // Events
    public event Action<int, int> OnHealthChanged; // current, max
    public event Action<int, int> OnShieldChanged; // current, max
    public event Action OnDeath;
    public event Action OnRespawn;
    public event Action<int> OnDamageTaken; // damage amount
    public event Action<int> OnHealed; // heal amount

    #region Unity Callbacks

    private void Awake()
    {
        _movement = GetComponent<AerialMovement>();
        _combat = GetComponent<CombatSystem>();
        _audioSource = GetComponent<AudioSource>();

        if (_audioSource == null)
        {
            _audioSource = gameObject.AddComponent<AudioSource>();
        }
    }

    private void Update()
    {
        if (IsServer)
        {
            HandleShieldRegeneration();
        }
    }

    #endregion

    #region Network Spawn

    public override void OnNetworkSpawn()
    {
        if (IsServer)
        {
            // Initialize health and shield
            _health.Value = maxHealth;
            _shield.Value = hasShield ? maxShield : 0;
            _isAlive.Value = true;
            _isInvulnerable.Value = true;

            // Start with invulnerability
            StartCoroutine(InvulnerabilityCoroutine());
        }

        // Subscribe to value changes for UI updates
        _health.OnValueChanged += OnHealthValueChanged;
        _shield.OnValueChanged += OnShieldValueChanged;
        _isAlive.OnValueChanged += OnAliveValueChanged;

        // Trigger initial events
        OnHealthChanged?.Invoke(_health.Value, maxHealth);
        OnShieldChanged?.Invoke(_shield.Value, maxShield);
    }

    public override void OnNetworkDespawn()
    {
        _health.OnValueChanged -= OnHealthValueChanged;
        _shield.OnValueChanged -= OnShieldValueChanged;
        _isAlive.OnValueChanged -= OnAliveValueChanged;
    }

    #endregion

    #region Damage & Healing

    /// <summary>
    /// Apply damage to this player (call from anywhere, will be validated on server)
    /// </summary>
    public void TakeDamage(int damage)
    {
        if (!IsServer) return;
        if (!_isAlive.Value || _isInvulnerable.Value) return;

        int actualDamage = damage;

        // Damage shield first
        if (_shield.Value > 0)
        {
            int shieldDamage = Mathf.Min(_shield.Value, damage);
            _shield.Value -= shieldDamage;
            actualDamage -= shieldDamage;

            // Shield broken
            if (_shield.Value <= 0)
            {
                PlaySoundClientRpc(shieldBreakSound);
            }
        }

        // Damage health
        if (actualDamage > 0)
        {
            _health.Value = Mathf.Max(_health.Value - actualDamage, 0);
        }

        _lastDamageTime = Time.time;
        _isRegeneratingShield = false;

        // Trigger damage events and effects
        OnDamageTaken?.Invoke(damage);
        PlayDamageEffectClientRpc();

        // Check for death
        if (_health.Value <= 0)
        {
            Die();
        }
    }

    /// <summary>
    /// Heal this player
    /// </summary>
    public void Heal(int amount)
    {
        if (!IsServer) return;
        if (!_isAlive.Value) return;

        int oldHealth = _health.Value;
        _health.Value = Mathf.Min(_health.Value + amount, maxHealth);

        int actualHeal = _health.Value - oldHealth;
        if (actualHeal > 0)
        {
            OnHealed?.Invoke(actualHeal);
            PlayHealEffectClientRpc();
        }
    }

    /// <summary>
    /// Restore shield
    /// </summary>
    public void RestoreShield(int amount)
    {
        if (!IsServer) return;
        if (!hasShield) return;

        _shield.Value = Mathf.Min(_shield.Value + amount, maxShield);
    }

    #endregion

    #region Shield Regeneration

    private void HandleShieldRegeneration()
    {
        if (!hasShield || !_isAlive.Value) return;
        if (_shield.Value >= maxShield) return;

        // Start regeneration after delay
        if (Time.time - _lastDamageTime >= shieldRegenDelay && !_isRegeneratingShield)
        {
            _isRegeneratingShield = true;
        }

        // Regenerate shield
        if (_isRegeneratingShield)
        {
            float regenAmount = shieldRegenRate * Time.deltaTime;
            _shield.Value = Mathf.Min(_shield.Value + Mathf.RoundToInt(regenAmount), maxShield);
        }
    }

    #endregion

    #region Death & Respawn

    private void Die()
    {
        if (!IsServer) return;
        if (!_isAlive.Value) return;

        _isAlive.Value = false;
        _health.Value = 0;

        // Trigger death event
        OnDeath?.Invoke();

        // Play death effects
        PlayDeathEffectClientRpc();

        // Disable gameplay components
        DisableGameplayClientRpc();

        // Start respawn timer
        StartCoroutine(RespawnCoroutine());
    }

    private IEnumerator RespawnCoroutine()
    {
        yield return new WaitForSeconds(respawnDelay);

        if (IsServer)
        {
            Respawn();
        }
    }

    private void Respawn()
    {
        if (!IsServer) return;

        // Reset health and shield
        _health.Value = maxHealth;
        _shield.Value = hasShield ? maxShield : 0;
        _isAlive.Value = true;
        _isInvulnerable.Value = true;

        // Find spawn point
        Vector3 spawnPosition = FindSpawnPoint();
        transform.position = spawnPosition;

        // Re-enable gameplay
        EnableGameplayClientRpc();

        // Play spawn effect
        PlaySpawnEffectClientRpc();

        // Trigger respawn event
        OnRespawn?.Invoke();

        // Start invulnerability
        StartCoroutine(InvulnerabilityCoroutine());
    }

    private Vector3 FindSpawnPoint()
    {
        // TODO: Implement proper spawn point system
        // For now, return a default position
        GameObject[] spawnPoints = GameObject.FindGameObjectsWithTag("SpawnPoint");
        if (spawnPoints.Length > 0)
        {
            int randomIndex = UnityEngine.Random.Range(0, spawnPoints.Length);
            return spawnPoints[randomIndex].transform.position;
        }

        return new Vector3(0, 5, 0); // Default spawn position
    }

    private IEnumerator InvulnerabilityCoroutine()
    {
        yield return new WaitForSeconds(invulnerabilityDuration);

        if (IsServer)
        {
            _isInvulnerable.Value = false;
        }
    }

    #endregion

    #region Network Value Changed Callbacks

    private void OnHealthValueChanged(int oldValue, int newValue)
    {
        OnHealthChanged?.Invoke(newValue, maxHealth);
    }

    private void OnShieldValueChanged(int oldValue, int newValue)
    {
        OnShieldChanged?.Invoke(newValue, maxShield);
    }

    private void OnAliveValueChanged(bool oldValue, bool newValue)
    {
        // Can trigger additional logic here
    }

    #endregion

    #region Network RPCs

    [ClientRpc]
    private void PlayDamageEffectClientRpc()
    {
        // Spawn damage VFX
        if (damageFX != null)
        {
            GameObject effect = Instantiate(damageFX, transform.position, Quaternion.identity);
            effect.transform.SetParent(transform);
            Destroy(effect, 1f);
        }

        // Play damage sound
        PlaySound(damageSound);

        // Screen shake or camera effect for owner
        if (IsOwner)
        {
            // TODO: Add camera shake
        }
    }

    [ClientRpc]
    private void PlayDeathEffectClientRpc()
    {
        // Spawn death VFX
        if (deathFX != null)
        {
            GameObject effect = Instantiate(deathFX, transform.position, Quaternion.identity);
            Destroy(effect, 3f);
        }

        // Play death sound
        PlaySound(deathSound);
    }

    [ClientRpc]
    private void PlayHealEffectClientRpc()
    {
        // Spawn heal VFX
        if (healFX != null)
        {
            GameObject effect = Instantiate(healFX, transform.position, Quaternion.identity);
            effect.transform.SetParent(transform);
            Destroy(effect, 2f);
        }

        // Play heal sound
        PlaySound(healSound);
    }

    [ClientRpc]
    private void PlaySpawnEffectClientRpc()
    {
        // Spawn effect VFX
        if (spawnFX != null)
        {
            GameObject effect = Instantiate(spawnFX, transform.position, Quaternion.identity);
            Destroy(effect, 2f);
        }
    }

    [ClientRpc]
    private void PlaySoundClientRpc(AudioClip clip)
    {
        PlaySound(clip);
    }

    [ClientRpc]
    private void DisableGameplayClientRpc()
    {
        // Disable movement
        if (_movement != null)
        {
            _movement.enabled = false;
        }

        // Disable combat
        if (_combat != null)
        {
            _combat.enabled = false;
        }

        // Hide or ragdoll model
        // TODO: Implement ragdoll or hide visual
    }

    [ClientRpc]
    private void EnableGameplayClientRpc()
    {
        // Re-enable movement
        if (_movement != null)
        {
            _movement.enabled = true;
            _movement.StopMovement();
        }

        // Re-enable combat
        if (_combat != null)
        {
            _combat.enabled = true;
        }

        // Show model
        // TODO: Re-enable visual
    }

    #endregion

    #region Audio

    private void PlaySound(AudioClip clip)
    {
        if (_audioSource != null && clip != null)
        {
            _audioSource.PlayOneShot(clip);
        }
    }

    #endregion

    #region Public Getters

    /// <summary>
    /// Get current health
    /// </summary>
    public int GetHealth() => _health.Value;

    /// <summary>
    /// Get max health
    /// </summary>
    public int GetMaxHealth() => maxHealth;

    /// <summary>
    /// Get current shield
    /// </summary>
    public int GetShield() => _shield.Value;

    /// <summary>
    /// Get max shield
    /// </summary>
    public int GetMaxShield() => maxShield;

    /// <summary>
    /// Check if player is alive
    /// </summary>
    public bool IsPlayerAlive() => _isAlive.Value;

    /// <summary>
    /// Check if player is invulnerable
    /// </summary>
    public bool IsPlayerInvulnerable() => _isInvulnerable.Value;

    /// <summary>
    /// Get health percentage (0-1)
    /// </summary>
    public float GetHealthPercent() => (float)_health.Value / maxHealth;

    /// <summary>
    /// Get shield percentage (0-1)
    /// </summary>
    public float GetShieldPercent() => hasShield ? (float)_shield.Value / maxShield : 0f;

    #endregion
}
