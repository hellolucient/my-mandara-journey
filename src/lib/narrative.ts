import { formatEventDate, type Pronoun, type StoryEvent } from "@/lib/types";

function lowerFirst(value: string): string {
  const text = value.trim();
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function person(name: string, pronoun: Pronoun): string {
  const trimmed = name.trim();
  if (trimmed) return trimmed;
  if (pronoun === "he") return "He";
  if (pronoun === "they") return "They";
  return "She";
}

function pronounWord(pronoun: Pronoun): string {
  return pronoun;
}

export function draftNarrative(input: {
  name: string;
  sinceLabel: string;
  pronoun: Pronoun;
  events: StoryEvent[];
}): string {
  const name = person(input.name, input.pronoun);
  const word = pronounWord(input.pronoun);
  const since = input.sinceLabel.trim();
  const events = input.events.filter((event) => event.title.trim() || event.detail.trim());
  if (events.length === 0) {
    return since
      ? `${name} has been with Mandara since ${since}.`
      : `${name} is part of the Mandara team.`;
  }

  const sentences: string[] = [];
  const first = events[0];
  const opening = since ? `${name} began with Mandara in ${since}` : `${name} began with Mandara`;
  const firstDetail = [first.title.trim(), first.detail.trim()].filter(Boolean).join(", ");
  const firstPlace = first.placeLabel.trim();
  const firstPlaceBit =
    firstPlace && !firstDetail.toLowerCase().includes(firstPlace.toLowerCase())
      ? ` — ${firstPlace}`
      : "";
  sentences.push(`${opening}, ${lowerFirst(firstDetail)}${firstPlaceBit}.`);

  for (const event of events.slice(1)) {
    const title = [event.title.trim(), event.detail.trim()].filter(Boolean).join(", ");
    if (!title) continue;
    if (event.kind === "next") {
      sentences.push(`${name} plans to ${lowerFirst(title)}.`);
      continue;
    }
    const when = formatEventDate(event);
    const place = event.placeLabel.trim();
    const whenBit =
      when && when.toLowerCase() !== "next"
        ? `In ${when.replace(/^in\s+/i, "")}`
        : `Then ${word}`;
    const placeBit =
      place && !title.toLowerCase().includes(place.toLowerCase()) ? ` at ${place}` : "";
    sentences.push(`${whenBit}, ${lowerFirst(title)}${placeBit}.`);
  }

  return sentences.join(" ").replace(/\s+/g, " ").trim();
}
