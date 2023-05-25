const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/add", async (req, res) => {
  const { username, score } = req.body;

  try {
    const existingUser = await prisma.score.findFirst({
      where: { username: username },
    });

    if (existingUser) {
      const result = await prisma.score.update({
        where: { id: existingUser.id },
        data: { score: existingUser.score + score },
      });

      console.log(`Score updated for ${username}`);
      res.json(result);
    } else {
      const result = await prisma.score.create({
        data: {
          username,
          score,
        },
      });
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get("/top10", async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      orderBy: {
        score: "desc",
      },
      take: 10,
    });
    res.json(scores);
  } catch {
    res.sendStatus(400);
  }
});

router.get("/allUsernames", async (req, res) => {
  try {
    const scores = await prisma.score.findMany();
    const usernames = scores.map((score) => score.username);
    res.json(usernames);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;