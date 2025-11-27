using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RunAnalitics.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExecutionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ActualDistance",
                table: "TrainingLogs",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActualPace",
                table: "TrainingLogs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TrainingLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserNotes",
                table: "TrainingLogs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualDistance",
                table: "TrainingLogs");

            migrationBuilder.DropColumn(
                name: "ActualPace",
                table: "TrainingLogs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TrainingLogs");

            migrationBuilder.DropColumn(
                name: "UserNotes",
                table: "TrainingLogs");
        }
    }
}
