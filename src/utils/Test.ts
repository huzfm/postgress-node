import axios from "axios";

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

async function callAPI() {
  for (let i = 1; i <= 200; i++) {
    const username = `user_${generateRandomString(5)}`;
    const email = `${username}@example.com`;
    const password = generateRandomString(10);

    try {
      const res = await axios.post("http://localhost:8080/users/signup", {
        username,
        password,
      });

      console.log(`✅ ${i}:`, res.data);
    } catch (err: any) {
      console.error(`❌ Error ${i}:`, err.response?.data || err.message);
    }
  }
}

callAPI();
