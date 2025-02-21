import fetch from "node-fetch";

const LEAGUE_IDS = {
  152: "Premier",
  302: "La Liga",
  175: "Budesliga",
  168: "Ligue 1",
  207: "Serie A",
  4: "Europa",
};

// Fetch sports fixtures
export const fetchFixtures = async () => {
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  try {
    const promises = Object.keys(LEAGUE_IDS).map(async (leagueId) => {
      const url = `https://apiv3.apifootball.com/?action=get_events&league_id=${leagueId}&APIkey=${process.env.APIkey}&from=${formattedDate}&to=${formattedDate}`;
      const response = await fetch(url);
      const data = await response.json();
      return {
        league: LEAGUE_IDS[leagueId],
        matches: Array.isArray(data) ? data : [],
      };
    });

    const results = await Promise.all(promises);

    // Format matches per league
    const matches = {};

    results.forEach(({ league, matches: leagueMatches }) => {
      matches[league] = leagueMatches.map((match) => ({
        time: match.match_time,
        status: match.match_status,
        home_team: match.match_hometeam_name,
        away_team: match.match_awayteam_name,
        home_team_score: match.match_hometeam_score,
        away_team_score: match.match_awayteam_score,
      }));
    });

    return matches;
  } catch (error) {
    console.error("Error fetching league fixtures", error);
    return {};
  }
};

// Sends data to Telex
export const processAndSendData = async (return_url) => {
  const fixtures = await fetchFixtures();

  if (!fixtures || Object.keys(fixtures).length === 0) {
    console.error("No fixtures available to send.");
    return;
  }

  // Construct the formatted message
  let message = "SPORTS UPDATE\n\n";

  for (const [league, matches] of Object.entries(fixtures)) {
    message += `${league.toUpperCase()}\n`;
    matches.forEach((match) => {
      message += `${match.home_team} --  vs --  ${match.away_team}\n`;
      message += `Status:  ${match.status} mins\n`;
      message += `Time: ${match.time}   |   Score: ${match.home_team_score}-${match.away_team_score}\n\n`;
    });
  }

  // Construct payload for Telex
  const payload = {
    event_name: "Sports Update",
    username: "Footbal Fixtures Bot",
    status: "success",
    message, // Send the formatted message
  };

  // console.log("Sending Payload to Telex:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(return_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Telex response error: ${response.status}`);
    }

    // console.log("Fixtures successfully sent to Telex");
  } catch (error) {
    console.error("Error sending data to Telex", error);
  }
};
