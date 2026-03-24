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

// ROLES & CATEGORIES
const verifyRole = "1407804800652935328";
const moreiraCategory = "1421409246557507694";
const pereiraCategory = "1440523926957457481";
const apuliaCategory = "1485779490914304081"; // ✔️ CORRIGIDO

// LOGO
const logo = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3RxcTZkMDJ1dm41dGdndjlyc2htMndhamp6eW10MWZsazR0YnR3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q74nh3Qlfo18oggky3/giphy.gif";

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

// MESSAGES
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  const msg = message.content.toLowerCase();

  // ===== VERIFY =====
  if (msg === "!verify") {
    const embed = new EmbedBuilder()
      .setTitle("✅ SERVER VERIFICATION")
      .setDescription(
        "To access the server, please complete the verification.\n\n" +
        "➡ Click the button below.\n" +
        "➡ Wait a few seconds for confirmation.\n" +
        "➡ You will then gain full access."
      )
      .setColor("Green")
      .setImage(logo);

    const button = new ButtonBuilder()
      .setCustomId("verify_button")
      .setLabel("Verify")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    return message.channel.send({ embeds: [embed], components: [row] });
  }

  // ===== BOOST =====
  if (msg === "!boost") {
    const embed = new EmbedBuilder()
      .setTitle("🚀 BOOST THE SERVER")
      .setDescription(`Boost the server and unlock:

💎 Premium FiveM Sound Packs
📦 Exclusive FiveM Packs
🎮 Private Scripts
💬 Booster Chat
🎁 Future exclusive drops`)
      .setColor("Purple")
      .setImage(logo);

    return message.channel.send({ embeds: [embed] });
  }

  // ===== PARTNER =====
 if (msg === "!partner") {
  const embed = new EmbedBuilder()
    .setTitle("🤝 PARTNER WITH M&P!")
    .setDescription(`Do you want to boost your community and get exclusive exposure?

💡 Benefits of partnering with M&P Helper:
🔹 Custom collaborations and promotions
🔹 Special access to premium resources
🔹 Priority support for your projects

Click the button below to open a Partnership Ticket and get started!`)
    .setColor("Blue");

  const button = new ButtonBuilder()
    .setCustomId("partner_ticket")
    .setLabel("Open Partnership Ticket")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);
  message.channel.send({ embeds: [embed], components: [row] });
}

  // ===== STREAMER =====
  if (msg === "!streamer") {
  const embed = new EmbedBuilder()
    .setTitle("🎥 Become a Streamer on Our Server!")
    .setDescription(`Want to stream and grow with our community?

💡 Benefits for streamers:
🔹 Exclusive access to the server
🔹 Support from the community to increase your views
🔹 Get your own Streamer Tag to stand out

Click the button below to open a ticket and start streaming now!`)
    .setColor("Purple");

  const button = new ButtonBuilder()
    .setCustomId("streamer_ticket")
    .setLabel("Open Streamer Ticket")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);
  message.channel.send({ embeds: [embed], components: [row] });
}
  // ===== TICKETS =====
  if (msg === "!ticket") {

    const createPanel = async (title, id, color) => {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription("Click the button below to open a ticket.")
        .setColor(color);

      const button = new ButtonBuilder()
        .setCustomId(id)
        .setLabel("Open Ticket")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await message.channel.send({ embeds: [embed], components: [row] });
    };

    await createPanel("🎬 Ticket Moreira", "ticket_moreira", "Blue");
    await createPanel("🖼 Ticket Pereira", "ticket_pereira", "Green");
    await createPanel("🌊 Ticket Apulia", "ticket_apulia", "Red");
  }
});

// BUTTONS
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  // VERIFY
  if (interaction.customId === "verify_button") {
    const role = interaction.guild.roles.cache.get(verifyRole);
    if (!role) {
      return interaction.reply({ content: "Erro: cargo não encontrado.", ephemeral: true });
    }

    await interaction.member.roles.add(role);

    return interaction.reply({
      content: "✅ Verificado com sucesso!",
      ephemeral: true
    });
  }

  // CREATE TICKETS
  if (
    interaction.customId.includes("ticket") ||
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

    if (interaction.customId === "ticket_apulia") {
      category = apuliaCategory;
      name = `apulia-${data.count}`;
    }

    if (interaction.customId === "partner_ticket") {
      category = pereiraCategory;
      name = `partner-${data.count}`;
    }

    if (interaction.customId === "streamer_ticket") {
      category = pereiraCategory;
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

    await channel.send({
      content: `Ticket opened by ${interaction.user}`,
      components: [row]
    });

    return interaction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  // CLOSE
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
