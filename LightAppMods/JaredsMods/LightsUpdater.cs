using System;
using System.Net.Http;
using PowerLights;

namespace JaredsMods {
    // Super hacky class we inject into an assembly to wire the lights up
    public static class LightsUpdater {
        private static readonly HttpClient _httpClient = new HttpClient {
            BaseAddress = new Uri("http://localhost:5050")
        };

        public static void UpdateLights(Referee leftRef, Referee centerRef, Referee rightRef) {
            try {
                var content = new StringContent($"{GetLightFromRef(leftRef)},{GetLightFromRef(centerRef)},{GetLightFromRef(rightRef)}");
                _httpClient.PostAsync("/lights", content);
            }
            catch {

            }
        }

        private static string GetLightFromRef(Referee referee) {
            if (referee.IsFailureBlue()) {
                return "BLUE";
            } else if (referee.IsFailureYellow()) {
                return "YELLOW";
            }
            else if (referee.IsFailureRed()) {
                return "RED";
            }
            else {
                return "WHITE";
            }
        }
    }
}
