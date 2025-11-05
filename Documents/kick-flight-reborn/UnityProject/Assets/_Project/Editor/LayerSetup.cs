#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace KickFlight.Editor
{
    /// <summary>
    /// Helper to setup layers and tags for Kick Flight
    /// </summary>
    public class LayerSetup
    {
        [MenuItem("Tools/Kick Flight/Setup Layers and Tags")]
        public static void SetupLayersAndTags()
        {
            Debug.Log("Setting up layers and tags...");

            // Add tags
            AddTag("Player");
            AddTag("Enemy");
            AddTag("Crystal");
            AddTag("SpawnPoint");
            AddTag("Projectile");
            AddTag("DeathZone");

            // Add layers
            AddLayer("Player", 6);
            AddLayer("Environment", 7);
            AddLayer("Collectible", 8);
            AddLayer("Projectile", 9);

            Debug.Log("✅ Layers and tags setup complete!");
        }

        private static void AddTag(string tag)
        {
            SerializedObject tagManager = new SerializedObject(
                AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/TagManager.asset")[0]);
            SerializedProperty tagsProp = tagManager.FindProperty("tags");

            // Check if tag already exists
            bool found = false;
            for (int i = 0; i < tagsProp.arraySize; i++)
            {
                SerializedProperty t = tagsProp.GetArrayElementAtIndex(i);
                if (t.stringValue.Equals(tag))
                {
                    found = true;
                    break;
                }
            }

            // Add tag if not found
            if (!found)
            {
                tagsProp.InsertArrayElementAtIndex(0);
                SerializedProperty n = tagsProp.GetArrayElementAtIndex(0);
                n.stringValue = tag;
                tagManager.ApplyModifiedProperties();
                Debug.Log($"Added tag: {tag}");
            }
        }

        private static void AddLayer(string layerName, int layerIndex)
        {
            SerializedObject tagManager = new SerializedObject(
                AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/TagManager.asset")[0]);
            SerializedProperty layers = tagManager.FindProperty("layers");

            if (layers == null || !layers.isArray)
            {
                Debug.LogError("Can't find layers property");
                return;
            }

            SerializedProperty layerProp = layers.GetArrayElementAtIndex(layerIndex);

            if (layerProp.stringValue == string.Empty)
            {
                layerProp.stringValue = layerName;
                tagManager.ApplyModifiedProperties();
                Debug.Log($"Added layer: {layerName} at index {layerIndex}");
            }
            else
            {
                Debug.Log($"Layer {layerIndex} already set to: {layerProp.stringValue}");
            }
        }
    }
}
#endif
