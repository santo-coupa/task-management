using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace task_management_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserTaskRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_Users_AssignedUserId",
                table: "UserTasks");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "UserTasks",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "AssignedUserId",
                table: "UserTasks",
                newName: "CreatedById");

            migrationBuilder.RenameIndex(
                name: "IX_UserTasks_AssignedUserId",
                table: "UserTasks",
                newName: "IX_UserTasks_CreatedById");

            migrationBuilder.AddColumn<Guid>(
                name: "AssigneeId",
                table: "UserTasks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "UserTasks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "UserTasks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "UserTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "UserTasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTasks_AssigneeId",
                table: "UserTasks",
                column: "AssigneeId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_Users_AssigneeId",
                table: "UserTasks",
                column: "AssigneeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_Users_CreatedById",
                table: "UserTasks",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_Users_AssigneeId",
                table: "UserTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_Users_CreatedById",
                table: "UserTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserTasks_AssigneeId",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "AssigneeId",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "UserTasks");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "UserTasks",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "UserTasks",
                newName: "AssignedUserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserTasks_CreatedById",
                table: "UserTasks",
                newName: "IX_UserTasks_AssignedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_Users_AssignedUserId",
                table: "UserTasks",
                column: "AssignedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
