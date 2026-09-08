import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const englishWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'water', 'long', 'find', 'here', 'thing', 'many', 'such', 'own', 'under', 'last',
  'right', 'move', 'high', 'world', 'place', 'part', 'sound', 'still', 'hand', 'small', 'add', 'land',
  'big', 'air', 'help', 'line', 'turn', 'cause', 'same', 'mean', 'differ', 'follow', 'act', 'why', 'ask',
  'men', 'change', 'light', 'kind', 'need', 'house', 'picture', 'again', 'point', 'mother', 'near',
  'build', 'self', 'earth', 'father', 'head', 'stand', 'page', 'should', 'country', 'found', 'answer',
  'school', 'grow', 'study', 'learn', 'plant', 'cover', 'food', 'sun', 'four', 'thought', 'city', 'tree',
  'cross', 'farm', 'hard', 'start', 'might', 'story', 'saw', 'far', 'sea', 'draw', 'left', 'late', 'run',
  'while', 'press', 'close', 'night', 'real', 'life', 'few', 'north', 'open', 'seem', 'together', 'next',
  'white', 'children', 'begin', 'got', 'walk', 'example', 'ease', 'paper', 'group', 'always', 'music',
  'those', 'both', 'mark', 'often', 'letter', 'until', 'mile', 'river', 'car', 'feet', 'care', 'second',
  'enough', 'plain', 'girl', 'usual', 'young', 'ready', 'above', 'ever', 'red', 'list', 'though', 'feel',
  'talk', 'bird', 'soon', 'body', 'dog', 'family', 'direct', 'leave', 'song', 'measure', 'door', 'product',
  'black', 'short', 'class', 'wind', 'question', 'happen', 'complete', 'ship', 'area', 'half', 'rock',
];

const uzbekWords = [
  'bugun', 'kecha', 'ertaga', 'hozir', 'keyin', 'oldin', 'doim', 'hech', "ba'zan", 'tez', 'sekin', 'uzoq',
  'yaqin', 'katta', 'kichik', 'yangi', 'eski', 'yaxshi', 'yomon', 'chiroyli', 'baland', 'past', 'keng',
  'tor', 'issiq', 'sovuq', 'iliq', 'quruq', "ho'l", "to'g'ri", 'egri', 'oson', 'qiyin', 'kuchli', 'zaif',
  "sog'lom", 'kasal', 'boy', 'ochiq', 'yopiq', "to'la", "bo'sh", 'uy', 'maktab', 'kitob', 'daftar', 'qalam',
  'stol', 'stul', 'eshik', 'deraza', 'devor', 'xona', 'hovli', "bog'", 'gul', 'daraxt', 'meva', 'sabzavot',
  'olma', 'uzum', 'non', 'guruch', "go'sht", 'baliq', 'sut', 'tuxum', 'tuz', 'shakar', 'asal', 'choy',
  'qahva', 'suv', 'muz', 'qor', "yomg'ir", 'quyosh', 'oy', 'yulduz', 'osmon', 'yer', 'tog', 'dengiz',
  'daryo', "ko'l", "o'rmon", 'shamol', 'oila', 'ona', 'ota', 'aka', 'uka', 'opa', 'singil', 'bola', 'odam',
  'inson', "do'st", 'hayot', 'dunyo', 'vaqt', 'kun', 'tun', 'hafta', 'yil', 'soat', 'daqiqa', 'ish', 'dam',
  "o'yin", 'sport', 'futbol', 'film', 'kino', 'musiqa', 'rasm', 'gap', "so'z", 'til', 'xat', 'telefon',
  'kompyuter', 'internet', 'dastur', 'dars', 'imtihon', 'bilim', 'ilm', 'fan', 'tarix', 'adabiyot', "san'at",
  'bozor', "do'kon", 'pul', 'narx', 'shahar', 'qishloq', "yo'l", 'mashina', 'samolyot', 'poyezd', 'kema',
  'ovqat', 'nonushta', 'tushlik', 'kechki', 'mehmon', 'bayram', 'sevgi', "do'stlik", 'nikoh', 'kuch', 'aql',
  'yurak', "qo'l", 'oyoq', 'bosh', "ko'z", 'quloq', "og'iz", 'burun', 'soch', 'tish',
];

async function main() {
  const englishData = [...new Set(englishWords)].map((text) => ({
    text,
    language: 'EN' as const,
  }));
  const uzbekData = [...new Set(uzbekWords)].map((text) => ({
    text,
    language: 'UZ' as const,
  }));

  const { count: enCount } = await prisma.word.createMany({
    data: englishData,
    skipDuplicates: true,
  });
  const { count: uzCount } = await prisma.word.createMany({
    data: uzbekData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${enCount} English words and ${uzCount} Uzbek words.`);

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    console.log(`Will auto-promote to ADMIN on first login: ${adminEmails.join(', ')}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
