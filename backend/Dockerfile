# Estágio 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura as dependências
COPY *.csproj .
RUN dotnet restore

# Copia o restante do código e faz o build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Estágio 2: Imagem Final (Otimizada)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expor a porta padrão do Kestrel (a porta 8080 será usada pelo compose)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "RunAnalitics.Api.dll"]