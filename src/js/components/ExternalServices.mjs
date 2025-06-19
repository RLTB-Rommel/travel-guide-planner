let diningData = [];
let adventureData = [];
let attractionData = [];
let educationalData = [];

export async function fetchDiningData() {
  if (diningData.length === 0) {
    const res = await fetch('/assets/data/dining-v3.json');
    diningData = await res.json();
  }
  return diningData;
}

export async function fetchAdventureData() {
  if (adventureData.length === 0) {
    const res = await fetch('/assets/data/adventure-v3.json');
    adventureData = await res.json();
  }
  return adventureData;
}

export async function fetchAttractionData() {
  if (attractionData.length === 0) {
    const res = await fetch('/assets/data/attractions-v3.json');
    attractionData = await res.json();
  }
  return attractionData;
}

export async function fetchEducationalData() {
  if (educationalData.length === 0) {
    const res = await fetch('/assets/data/educational-v3.json');
    educationalData = await res.json();
  }
  return educationalData;
}