import { Client, ClientOptions, Collection, EmbedBuilder } from "discord.js";
import * as fs from 'fs'
import * as path from 'path'
import { PreFixCommands, SlashCommands } from "../cmds";
import prefixModel from "../database/models/prefixModel";
import balanceModel from "../database/models/balanceModel";
import { Track } from "discord-player";
import { BaseComponent, Components, StringSelectMenuComponent, ButtonComponent } from "../component";

export class BaseClient extends Client {
     timeStampUser: Collection<string, NodeJS.Timeout>;
     readonly prefixCommands: PreFixCommands[];
     readonly slashCommands: SlashCommands[];
     readonly prefix: string;
     readonly components: Components

     constructor(clientOptions: ClientOptions) {
          super(clientOptions);

          this.prefixCommands = this.getTextCommands();
          this.slashCommands = this.getLocalCommands();
          this.timeStampUser = new Collection();
          this.prefix = (configure.app.prefix);
          this.components = this.getComponents();
     }

     ////////////////////////// Root functions
     private getTextCommands(exceptions: string[] = []): PreFixCommands[] | [] {

          const prefixCommands: PreFixCommands[] = [];

          const commandCategories = this.getAllFiles(
               path.join(__dirname, '..', 'prefixCmds'),
               true
          );
          for (const commandCategory of commandCategories) {
               const commandFiles = this.getAllFiles(commandCategory);

               for (const commandFile of commandFiles) {
                    const commandObject: PreFixCommands = require(commandFile);
                    if (exceptions.includes(commandObject.name)) {
                         continue;
                    }

                    prefixCommands.push(commandObject);
               }
          }
          return prefixCommands;
     }

     private getLocalCommands(exceptions: string[] = []): SlashCommands[] | [] {
          const localCommands: SlashCommands[] = [];

          const commandCategories = this.getAllFiles(
               path.join(__dirname, '..', 'commands'),
               true
          );

          for (const commandCategory of commandCategories) {
               const commandFiles = this.getAllFiles(commandCategory);

               for (const commandFile of commandFiles) {
                    const commandObject = require(commandFile);

                    if (exceptions.includes(commandObject.name)) {
                         continue;
                    }

                    localCommands.push(commandObject);
               }
          }


          return localCommands;
     }

     private getComponents(exceptions: string[] = []): Components {

          const menus = [] as StringSelectMenuComponent[];
          const buttons = [] as ButtonComponent[];

          const componentsCategories = this.getAllFiles(
               path.join(__dirname, '..', 'components'),
               true
          );
          for (const componentTypeDirectory of componentsCategories) {
               const components = this.getAllFiles(componentTypeDirectory);
               const componentName = componentTypeDirectory.replace(/\\/g, '/').split('/').pop();

               for (const component of components) {
                    const componentObject = require(component) as BaseComponent;
                    switch (componentName) {
                         case "menu":
                              menus.push(componentObject);
                              break;
                         case "button":
                              buttons.push(componentObject);
                              break;
                         default:
                              break;
                    }
               }

          }

          return { menus: menus, buttons: buttons };
     }


     public getAllFiles(directory: string, foldersOnly: boolean = false): string[] {
          const fileNames: string[] = [];
          try {
               const files = fs.readdirSync(directory, { withFileTypes: true });
               for (const file of files) {
                    const filePath = path.join(directory, file.name);

                    if (foldersOnly) {
                         if (file.isDirectory()) {
                              fileNames.push(filePath);
                         }
                    } else {
                         if (file.isFile()) {
                              fileNames.push(filePath);
                         }
                    }
               }

          } catch (error) {
               console.log("Skip read folders!");
          }

          return fileNames;
     }

     public async getPrefix(guildId: string) {
          const prefixData = await prefixModel.findOne({ guildId: guildId });
          if (!prefixData) return null;
          return prefixData.prefix;
     }

     /////////////////////////////////////


     ///////////////////// Music Functions
     public checkIdRequest(track: Track, userId: string): EmbedBuilder | boolean {
          if (track.requestedBy!.id !== userId) {
               return new EmbedBuilder()
                    .setAuthor({ name: `❌ Có lỗi khi yêu cầu dừng/bỏ qua bài hát` })
                    .setDescription(`Bài hát này là yêu cầu của : ${track.requestedBy?.toString()}`)
          } else {
               return false;
          }
     };





     ////////// Economy functions
     public xemTien(userId: string): Promise<number> {
          return new Promise(async ful => {
               const data = await balanceModel.findOne({ userId: userId });
               if (!data) return ful(0);
               ful(data.money);
          });
     }
     public async addTien(userId: string, soTien: number) {
          try {
               let data = await balanceModel.findOne({ userId: userId });
               if (!data) data = new balanceModel({
                    userId: userId,
                    money: soTien
               })
               else data.money += soTien;
               await data.save();
          } catch (err) {
               console.log("Lỗi add tiền: ", err);
          }
     }
     public async truTien(userId: string, soTien: number) {
          try {
               let data = await balanceModel.findOne({ userId: userId });
               if (!data) data = new balanceModel({
                    userId: userId,
                    money: soTien
               })
               else data.money -= soTien;
               await data.save();
          } catch (err) {
               console.log("Lỗi trừ tiền: ", err);
          }
     }
     ///////////////////////////////////////////


}