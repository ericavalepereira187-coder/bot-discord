const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// IDS DAS CATEGORIAS
const moreiraCategory = "1421409246557507694";
const pereiraCategory = "1440523926957457481";
const apuliaCategory = "1485779490914304081";

// FILE
if (!fs.existsSync("./tickets.json")) {
  fs.writeFileSync("./tickets.json", JSON.stringify({ count: 0 }, null, 2));
}

let data = JSON.parse(fs.readFileSync("./tickets.json"));

function saveTickets() {
  fs.writeFileSync("./tickets.json", JSON.stringify(data, null, 2));
}

// READY
client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// COMANDO
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ticket") {

    // MOREIRA
    const embed1 = new EmbedBuilder()
      .setTitle("🎬 Ticket Moreira")
      .setDescription("Click the button below to open a ticket.")
      .setColor("Blue");

    const button1 = new ButtonBuilder()
      .setCustomId("ticket_moreira")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(button1);

    await message.channel.send({ embeds: [embed1], components: [row1] });

    // PEREIRA
    const embed2 = new EmbedBuilder()
      .setTitle("🖼 Ticket Pereira")
      .setDescription("Click the button below to open a ticket.")
      .setColor("Green");

    const button2 = new ButtonBuilder()
      .setCustomId("ticket_pereira")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row2 = new ActionRowBuilder().addComponents(button2);

    await message.channel.send({ embeds: [embed2], components: [row2] });

    // APULIA
    const embed3 = new EmbedBuilder()
      .setTitle("🌊 Ticket Apulia")
      .setDescription("Click the button below to open a ticket.")
      .setColor("Aqua");

    const button3 = new ButtonBuilder()
      .setCustomId("ticket_apulia")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row3 = new ActionRowBuilder().addComponents(button3);

    await message.channel.send({ embeds: [embed3], components: [row3] });
  }
});

// BOTÕES
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  if (
    interaction.customId === "ticket_moreira" ||
    interaction.customId === "ticket_pereira" ||
    interaction.customId === "ticket_apulia"
  ) {
    data.count++;
    saveTickets();

    let category;
    let name;

    if (interaction.customId === "ticket_moreira") {
      category = moreiraCategory;
      name = `moreira-${data.count}`;
    }

    if (interaction.customId === "ticket_pereira") {
      category = pereiraCategory;
      name = `pereira-${data.count}`;
    }

    if (interaction.customId === "ticket_apulia") {
      category = apuliaCategory;
      name = `apulia-${data.count}`;
    }

    const channel = await interaction.guild.channels.create({
      name: name,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages
          ]
        }
      ]
    });

    const close = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(close);

    await channel.send({
      content: `Ticket opened by ${interaction.user}`,
      components: [row]
    });

    await interaction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.customId === "close_ticket") {
    await interaction.reply("Closing ticket in 5 seconds...");

    setTimeout(() => {
      interaction.channel.delete();
    }, 5000);
  }
});

// LOGIN
const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN);
