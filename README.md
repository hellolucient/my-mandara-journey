# Mandara journeys

Spa managers sign in, write a short story for someone on their team, and print it as a landscape A5 card. The card is a single sheet for the wall: name, role, resort, quote, story, four photographs, a journey map, and a timeline. Drag each photograph to choose the part that shows. Empty frames are filled with a colour block.

## First visit

The first person to open the app creates the first desk login (a username and password). After signing in, **Logins** makes a username and password for each spa manager. Hand those out. Each manager only sees the people on their own desk.

Passwords are stored scrambled. A new login’s password is shown once, when you create it.

## A story card

1. **Add someone**.
2. Enter her name, role, current property, and when she joined Mandara.
3. Paste a quote.
4. Add up to four photographs. Each one is reduced to under 300 KB, which is enough for a sharp print at this size.
5. Add the timeline, in order. Pick a place when it should appear on the map.
6. **Draft from the timeline**, then edit the paragraph so it sounds like her.
7. **Save and open the card**. Print it, choose **A5 landscape**, and turn on background graphics. The sheet is one side.

**Sample card** shows a finished example. **Copy onto my desk** starts an editable copy without the sample illustrations, so you can add real photographs.

The map covers the Indian Ocean and Southeast Asia (Bali, the Maldives, Thailand, Sri Lanka, Singapore, Jakarta, and a few neighbours). A moment with no pin still prints on the timeline.

## Run it locally

```bash
npm install
npm run dev
```

Open the address Next prints. Locally, stories are kept in a small database file under `data/`, which is not committed. When the app is published, it uses its own Postgres database instead.

## Print

The card is one sheet of 210 × 148 mm (A5 landscape). In the print dialog, set the paper size to A5 landscape and enable background graphics so the cream paper and the map print.
