using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    public async Task Move(string direction)
    {
        Console.WriteLine($"Movimiento recibido: {direction}");
        await Clients.All.SendAsync("move", direction);
    }
}