# Sports Interval Integration for Telex

## Overview

The **Sports Interval Integration** provides real-time football fixtures from major leagues and automatically updates every set interval. It fetches data from the API-Football service and sends structured match updates to Telex channels.

## Features

- Automated football fixture updates at specified intervals
- Supports multiple leagues, including Premier League, La Liga, Bundesliga, Ligue 1, Serie A, and Europa League
- Structured data formatting for easy readability
- Integrates seamlessly with Telex for message dispatch

## Prerequisites

- **Node.js** (v16 or later)
- **Express.js**
- **API-Football Key** (Required for fetching match data)
- **Telex Webhook URL** (For sending updates)
- **Render.com Deployment** (Optional, for hosting the integration)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/sports-interval-integration.git
cd sports-interval-integration
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following:

```env
PORT=5000
APIkey=your_api_football_key
```

### 4. Start the Server Locally

```sh
npm start
```

The server will run on `http://localhost:5000`.

## Endpoints

### Fetch Fixtures

```sh
GET /
```

Returns JSON data containing match fixtures.

### Telex Tick Endpoint

```sh
POST /tick
```

#### Request Body

```json
{
  "return_url": "https://ping.telex.im/v1/webhooks/YOUR_WEBHOOK_ID"
}
```

Triggers an update to fetch and send fixtures to Telex.

## Screenshot

Here is an example of the integration in action on a Telex channel:

![Telex Sports Update](https://res.cloudinary.com/dgk3ckyn1/image/upload/v1740210096/Screenshot_15_mb380h.png)

### Webhook Testing

```sh
POST /test-webhook
```

For testing webhook functionality.

## Deployment

### Deploy on Render

1. Push your code to GitHub.
2. Create a new web service on **Render.com**.
3. Connect the repository.
4. Set the environment variables in Render.
5. Deploy and obtain the public URL.

Update your `telex-integration-config.json` with the `tick_url`:

```json
"tick_url": "https://your-deployed-url.com/tick"
```

## Usage

1. Install the integration in Telex.
2. Configure the update interval (`*/12 * * * *` for every 12 minutes).
3. Assign the integration to a Telex channel.
4. Receive automated football updates in the channel.

## License

This project is open-source and available under the MIT License.
