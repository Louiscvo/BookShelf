#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

namespace KickFlight.Editor
{
    /// <summary>
    /// Automatically sets up the project on first import
    /// </summary>
    [InitializeOnLoad]
    public class ProjectSetup
    {
        private const string SETUP_COMPLETE_KEY = "KickFlight_SetupComplete";

        static ProjectSetup()
        {
            // Only run once
            if (EditorPrefs.GetBool(SETUP_COMPLETE_KEY, false))
                return;

            Debug.Log("🚀 Kick Flight: Reborn - Running initial setup...");

            CreateFolderStructure();
            ConfigureProjectSettings();
            
            EditorPrefs.SetBool(SETUP_COMPLETE_KEY, true);
            Debug.Log("✅ Kick Flight: Reborn - Setup complete!");
            Debug.Log("📚 Next steps: Install packages (Netcode, Input System, Cinemachine)");
        }

        private static void CreateFolderStructure()
        {
            Debug.Log("Creating folder structure...");
            // Folders already created, just refresh
            AssetDatabase.Refresh();
        }

        private static void ConfigureProjectSettings()
        {
            Debug.Log("Configuring project settings...");
            
            // Set color space to Linear
            PlayerSettings.colorSpace = ColorSpace.Linear;
            
            // Enable multithreaded rendering
            PlayerSettings.MTRendering = true;
            
            // Set company and product name
            PlayerSettings.companyName = "Kick Flight Community";
            PlayerSettings.productName = "Kick Flight Reborn";
            
            Debug.Log("✅ Project settings configured");
        }

        [MenuItem("Tools/Kick Flight/Setup Project")]
        public static void ManualSetup()
        {
            EditorPrefs.SetBool(SETUP_COMPLETE_KEY, false);
            CreateFolderStructure();
            ConfigureProjectSettings();
            EditorPrefs.SetBool(SETUP_COMPLETE_KEY, true);
            Debug.Log("✅ Manual setup complete!");
        }

        [MenuItem("Tools/Kick Flight/Reset Setup")]
        public static void ResetSetup()
        {
            EditorPrefs.DeleteKey(SETUP_COMPLETE_KEY);
            Debug.Log("Setup flag reset. Restart Unity to run setup again.");
        }
    }
}
#endif
