import axios from "axios";

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function generateRandomText(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789 ";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

async function createUserWithTodos(index: number) {
  const username = `user_${generateRandomString(5)}`;
  const password = generateRandomString(10);
  const confirmPassword = password; // Add confirmPassword logic

  try {
    // Create user with confirmPassword
    const userRes = await axios.post("http://localhost:8080/users/signup", {
      username,
      password,
      confirmPassword, // Include in payload
    });

    console.log(`🧪 Raw user response:`, userRes);

    const user_id = userRes.data.user.id;
    console.log(`✅ Created user ${index}: ${username} (ID: ${user_id})`);

    // Create 3 todos for this user
    for (let j = 1; j <= 3; j++) {
      const title = `Task ${j} for ${username}`;
      const description = generateRandomText(30);
      const done = Math.random() < 0.5 ? "false" : "true";

      await axios.post("http://localhost:8080/todos/addTodo", {
        title,
        description,
        done,
        user_id,
      });

      console.log(`   ➕ Todo ${j} added for ${username}`);
    }
  } catch (err: any) {
    console.error(
      `❌ Error for user ${index}:`,
      err.response?.data || err.message
    );
  }
}

async function main() {
  for (let i = 1; i <= 10; i++) {
    await createUserWithTodos(i);
  }
}

main();
