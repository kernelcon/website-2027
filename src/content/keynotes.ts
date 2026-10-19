import speakerConfig from "./speakers.json";

export interface KeynoteSpeaker {
  name: string;
  speaker_id: string;
  talk_id?: string;
  company?: string;
  twitter?: string;
  mastodon?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  image?: string;
  bio?: string;
}

// Add speaker_ids here as 2027 keynotes are confirmed.
export const KEYNOTE_SPEAKER_IDS = ["johnhammond"];

export const KEYNOTES: KeynoteSpeaker[] = (speakerConfig as { talks: { authors: KeynoteSpeaker[] }[] }[])
  .flatMap((g) => g.talks)
  .flatMap((t) => t.authors)
  .filter((a) => KEYNOTE_SPEAKER_IDS.includes(a.speaker_id));

export const hostLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
