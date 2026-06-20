// Shown once under the gift reveal, picked at random per redemption.
export const OCEAN_FUN_FACTS: string[] = [
  "🌊 World Oceans Day is observed on June 8 every year. It was officially recognized by the United Nations in 2008 to raise awareness about ocean conservation.",
  "🌍 The ocean covers about 71% of Earth's surface, making it the planet's largest ecosystem.",
  "🐠 Scientists estimate that over 80% of ocean species are still undiscovered, meaning most marine life is still unknown to us.",
  "🧊 The ocean produces at least 50% of the oxygen we breathe, largely thanks to tiny marine plants called phytoplankton.",
  "🐋 The blue whale, the largest animal ever known to exist, depends entirely on ocean ecosystems for survival.",
  "🗑️ Every year, millions of tons of plastic enter the ocean, threatening marine life and food chains.",
  "🌡️ The ocean absorbs about 90% of excess heat from climate change, helping regulate Earth's temperature.",
  "🐙 Some ocean zones are so deep that sunlight never reaches them, creating \"midnight zones\" where strange and bioluminescent creatures live.",
  "🐚 Coral reefs, often called the \"rainforests of the sea,\" support about 25% of all marine species, despite covering less than 1% of the ocean floor.",
  "🚢 The ocean is vital for humans too—about 90% of global trade travels by sea.",
];

export function getRandomOceanFact(): string {
  return OCEAN_FUN_FACTS[Math.floor(Math.random() * OCEAN_FUN_FACTS.length)];
}
