import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js"
import { BaseClient } from "./utils/clients"
import { GuildQueue } from "discord-player"

export type BaseComponent = {
     name: string
     callback: (client: BaseClient, interaction: unknown) => Promise<unknown>
}
export type Components = {
     menus: StringSelectMenuComponent[]
     buttons: ButtonComponent[]
}

export declare interface StringSelectMenuComponent extends BaseComponent {
     callback: (client: BaseClient, interaction: StringSelectMenuInteraction, values: string[]) => Promise<unknown>
}
export declare interface ButtonComponent extends BaseComponent {
     callback: (client: BaseClient, interaction: ButtonInteraction, customId: string, queue: GuildQueue) => Promise<unknown>
}
