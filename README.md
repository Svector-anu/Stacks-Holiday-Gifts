# Stacks Holiday Gifts 🎁

Send STX gifts to friends and family for the holidays! Create shareable gift links on the Stacks blockchain.

![Stacks Holiday Gifts](https://img.shields.io/badge/Stacks-Holiday%20Gifts-orange?style=for-the-badge&logo=bitcoin)

## Features

- 🎁 **Create Shareable Gift Links** - Send STX with a personal message
- 🔗 **Easy Claiming** - Recipients just connect a wallet and claim
- ⏰ **Auto-Refund** - Unclaimed gifts return after 14 days
- 🔒 **Secure** - Powered by Bitcoin via Stacks L2
- 🎄 **Holiday Themed** - Festive UI with Stacks branding

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Wallet**: Stacks Connect
- **Smart Contract**: Clarity
- **Testing**: Clarinet, Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- [Clarinet](https://docs.hiro.so/clarinet/getting-started) installed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Svector-anu/Stacks-Holiday-Gifts.git
cd Stacks-Holiday-Gifts
```

2. Install contract dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd web
npm install
```

4. Create environment file:
```bash
cp .env.example .env.local
# OR create .env.local with:
# NEXT_PUBLIC_NETWORK=testnet
# NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Smart Contract

Check the contract syntax:
```bash
clarinet check
```

Run tests:
```bash
npm test
```

Deploy to testnet:
```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

## Contract Functions

| Function | Description |
|----------|-------------|
| `create-gift` | Create a gift with STX amount, message, and secret hash |
| `claim-gift` | Claim a gift using the secret |
| `refund-gift` | Refund an expired gift (after 14 days) |
| `get-gift` | Get gift details |
| `is-claimable` | Check if a gift can still be claimed |

erce## Fee Structure

- **Service Fee**: 0.5% on gift creation
- **Expiry**: 14 days (~2016 blocks)

## License

MIT

## Acknowledgments

- Built on [Stacks](https://stacks.co) - Bitcoin L2
- Powered by [Clarity](https://docs.stacks.co/clarity) smart contracts
- UI inspired by Stacks brand guidelines

---

🎄 **Happy Holidays and enjoy your year!** 🎄
