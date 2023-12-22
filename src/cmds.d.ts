import { Interaction, Message } from "discord.js";
import { BaseClient } from "./utils/clients.ts";

export declare interface PreFixCommands extends Record<string, unknown> {
     readonly name: string
     readonly description: string
     aliases?: Array<string>
     adminOnly?: boolean

     callback: (client: BaseClient, message: Message, args: string[]) => Promise<void | unknown>

}

export declare interface SlashCommands extends Record<string, unknown> {
     name: string
     description: string

     callback: (client: BaseClient, interaction: Interaction) => Promise<void | unknown>
}