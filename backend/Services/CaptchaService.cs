using System.Text.Json;

namespace RunAnalitics.Api.Services;

public class CaptchaService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public CaptchaService(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    public async Task<bool> VerifyToken(string token)
    {
        // Em dev, se o token for vazio ou nulo, falha.
        if (string.IsNullOrWhiteSpace(token)) return false;

        // Chave Secreta de Teste da Cloudflare (Sempre Passa)
        // Em produção, isso viria de _config["Captcha:SecretKey"]
        var secretKey = "1x0000000000000000000000000000000AA"; 

        var client = _httpClientFactory.CreateClient();
        
        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("secret", secretKey),
            new KeyValuePair<string, string>("response", token)
        });

        var response = await client.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", content);
        
        if (!response.IsSuccessStatusCode) return false;

        var jsonString = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CaptchaResponse>(jsonString);

        return result?.Success ?? false;
    }

    // Classe auxiliar para ler o JSON da Cloudflare
    private class CaptchaResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("success")]
        public bool Success { get; set; }
    }
}