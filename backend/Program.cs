using Microsoft.AspNetCore.SignalR;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
    {
        policy
            //.WithOrigins("http://localhost:5173", "http://192.168.1.10:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseWebSockets();

app.UseCors("cors");

app.Map("/ws", async context =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = 400;
        return;
    }

    using var socket = await context.WebSockets.AcceptWebSocketAsync();

    Console.WriteLine("Cliente WebSocket conectado");

    var buffer = new byte[1024];

    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(buffer, CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
            break;

        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

        Console.WriteLine($"Recibido: {message}");
    }

    Console.WriteLine("Cliente desconectado");
});

app.MapHub<GameHub>("/game");

app.MapGet("/", () => "Backend OK");

app.Run();