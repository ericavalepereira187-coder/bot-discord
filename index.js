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

// TOKEN via ENV (GitHub / host)
const TOKEN = process.env.DISCORD_TOKEN;

const verifyRole = "1407804800652935328";
const moreiraCategory = "1421409246557507694";
const pereiraCategory = "1440523926957457481";

const logo = "https://media0.giphy.com/media/3ukaqy58FtBPaiL4HF/giphy.gif";

// Sistema de tickets
let data = { count: 0 };

if (fs.existsSync("./tickets.json")) {
  data = JSON.parse(fs.readFileSync("./tickets.json"));
}

function saveTickets() {
  fs.writeFileSync("./tickets.json", JSON.stringify(data, null, 2));
}

// READY
client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// COMANDOS
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  // VERIFY
  if (msg === "!verify") {
    const embed = new EmbedBuilder()
      .setTitle("SERVER VERIFICATION")
      .setDescription(`To access the server, please complete the verification.

➦ Click the button below
➦ Wait a few seconds
➦ Full access will be granted`)
      .setImage(logo)
      .setColor("Green");

    const button = new ButtonBuilder()
      .setCustomId("verify")
      .setLabel("Verify")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  }

  // BOOST
  if (msg === "!boost") {
    const embed = new EmbedBuilder()
      .setTitle("🚀 BOOST THE SERVER")
      .setDescription(`Boost the server and unlock:

💎 Premium FiveM Packs
📦 Exclusive Content
🎮 Private Scripts
💬 Booster Chat
🎁 Future rewards`)
      .setImage(logo)
      .setColor("Purple");

    message.channel.send({ embeds: [embed] });
  }

  // PARTNER
  if (msg === "!partner") {
    const embed = new EmbedBuilder()
      .setTitle("🤝 PARTNER WITH US!")
      .setDescription(`Want to grow your community?

🔹 Promotions
🔹 Exclusive content
🔹 Priority support

Click below to open a ticket`)
      .setImage(logo)
      .setColor("Blue");

    const button = new ButtonBuilder()
      .setCustomId("partner_ticket")
      .setLabel("Open Partnership Ticket")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  }

  // STREAMER
  if (msg === "!streamer") {
    const embed = new EmbedBuilder()
      .setTitle("🎥 Become a Streamer!")
      .setDescription(`Want to stream with us?

🔹 Grow your audience
🔹 Get support
🔹 Exclusive role

Click below to open a ticket`)
      .setImage(logo)
      .setColor("Purple");

    const button = new ButtonBuilder()
      .setCustomId("streamer_ticket")
      .setLabel("Open Streamer Ticket")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  }

  // TICKETS
  if (msg === "!ticket") {
    const embed1 = new EmbedBuilder()
      .setTitle("🎬 Ticket Moreira")
      .setDescription("Click to open a ticket")
      .setColor("Blue");

    const button1 = new ButtonBuilder()
      .setCustomId("ticket_moreira")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(button1);

    await message.channel.send({ embeds: [embed1], components: [row1] });

    const embed2 = new EmbedBuilder()
      .setTitle("🖼 Ticket Pereira")
      .setDescription("Click to open a ticket")
      .setColor("Green");

    const button2 = new ButtonBuilder()
      .setCustomId("ticket_pereira")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row2 = new ActionRowBuilder().addComponents(button2);

    message.channel.send({ embeds: [embed2], components: [row2] });
  }
});

// BOTÕES
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // VERIFY
  if (interaction.customId === "verify") {
    await interaction.member.roles.add(verifyRole);

    return interaction.reply({
      content: "✅ You are now verified!",
      ephemeral: true
    });
  }

  // CRIAR TICKET
  if (
    interaction.customId === "ticket_moreira" ||
    interaction.customId === "ticket_pereira" ||
    interaction.customId === "partner_ticket" ||
    interaction.customId === "streamer_ticket"
  ) {
    data.count++;
    saveTickets();

    let category = moreiraCategory;
    let name = `ticket-${data.count}`;

    if (interaction.customId === "ticket_pereira") {
      category = pereiraCategory;
      name = `pereira-${data.count}`;
    }

    if (interaction.customId === "partner_ticket") {
      name = `partner-${data.count}`;
    }

    if (interaction.customId === "streamer_ticket") {
      name = `streamer-${data.count}`;
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

    channel.send({
      content: `Ticket opened by ${interaction.user}`,
      components: [row]
    });

    interaction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  // FECHAR TICKET
  if (interaction.customId === "close_ticket") {
    interaction.reply("Closing ticket in 5 seconds...");

    setTimeout(() => {
      interaction.channel.delete();
    }, 5000);
  }
});

// LOGIN
client.login(TOKEN);
