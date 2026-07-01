using System.Collections.Concurrent;
using System.Net.WebSockets;
using QRCoder;
using System.Drawing;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseWebSockets();
app.UseCors("cors");

// CLIENTES CONECTADOS (THREAD SAFE)
var clients = new ConcurrentDictionary<Guid, WebSocket>();

app.Map("/ws", async context =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = 400;
        return;
    }

    var socket = await context.WebSockets.AcceptWebSocketAsync();

    var id = Guid.NewGuid();
    clients.TryAdd(id, socket);

    Console.WriteLine("Cliente conectado");

    var buffer = new byte[1024];

    try
    {
        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(buffer, CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Close)
                break;

            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

            Console.WriteLine($"Recibido: {message}");

            // BROADCAST A TODOS LOS CLIENTES
            var data = Encoding.UTF8.GetBytes(message);

            foreach (var client in clients)
            {
                if (client.Value.State == WebSocketState.Open)
                {
                    await client.Value.SendAsync(
                        data,
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }
            }
        }
    }
    finally
    {
        clients.TryRemove(id, out _);
        socket.Dispose();
        Console.WriteLine("Cliente desconectado");
    }
});

app.MapGet("/join", (HttpContext ctx) =>
{
    var token = Guid.NewGuid().ToString("N");

    Console.WriteLine($"Nuevo join: {token}");

    return Results.Redirect(
        $"https://853a213c.interactiveads.pages.dev/play?token={token}"
    );
});

app.MapGet("/qr", () =>
{
    using var qrGenerator = new QRCodeGenerator();

    var qrData = qrGenerator.CreateQrCode(
        "https://subventrally-excogitable-duncan.ngrok-free.dev/join",
        QRCodeGenerator.ECCLevel.Q);

    var pngQr = new PngByteQRCode(qrData);

    byte[] bytes = pngQr.GetGraphic(20);

    return Results.File(bytes, "image/png");
});

app.MapGet("/session", (HttpContext ctx) =>
{
    var token = Guid.NewGuid().ToString("N");

    return Results.Json(new
    {
        campaign = "Corona",
        game = "Surf",
        video = "Publicidad_Corona.mp4",
        expires = 120,
        joinUrl = $"https://subventrally-excogitable-duncan.ngrok-free.dev/join?token={token}",
        qrUrl = $"https://subventrally-excogitable-duncan.ngrok-free.dev/qr"
    });
});

app.MapGet("/", () => "Backend OK");

app.Run();