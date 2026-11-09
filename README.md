# 💖 Romantic Couple Website For My Wifey

Yeh website specially aapki aur aapki wife ke liye design ki gayi hai taaki aap unhe deeply impress kar sakein aur apni saari pyari yaadon aur unki pasandida baaton ko ek luxury, cinematic website par dikha sakein! ✨

---

## 🌟 Key Highlights & Features (Is Website Me Kya-Kya Hai)

1. **Floating Romantic Canvas Particles:** 
   - Screen par continuous floating hearts, glow particles aur stars background me chalte rehte hain.
2. **Romantic Ambient Music Player:** 
   - Screen par kahin bhi click karne par background me romantic melody shuru ho jati hai (with equalizer animation & play/pause toggle).
3. **Live Love Clock (Anniversary / Relationship Counter):** 
   - Real-time counter jo calculate karta hai ki aap dono ko saath me kitne Years, Days, Hours, Minutes aur Seconds ho chuke hain!
4. **Interactive Wax-Sealed Love Envelope:** 
   - Ek realistic 3D sealed envelope jise click karne par seal break hoti hai aur andar se ek personalised love letter unfold hota hai.
5. **"All About Her" (Her Favorites & Superpowers):** 
   - Uski favorite food cravings (Pani puri, cheese pizza, chocolates), mood boosters (hugs, long drives), cute habits, aesthetic colors aur dream travel destinations ke glassmorphism cards.
6. **Memory Lane (Polaroid Photo Wall & Lightbox):** 
   - Realistic Polaroid photo frames (washi tape, subtle tilt, captions ke sath). Photo click karne par full screen zoom modal khulta hai.
   - **In-Browser Photo Upload:** Aap bina code touch kiye seedha website se hi apne phone/computer se photos upload kar sakte hain!
7. **Chapters of Our Love Story (Interactive Timeline):** 
   - Pehli mulaqat, first date, propose moment, marriage day aur daily cute moments ki glowing vertical timeline.
8. **"Virtual Love Jar" (Reasons Why I Love You):** 
   - Ek golden origami love jar jise tap karne par ek-ek karke 20+ dil ko chhu lene wale reasons open hote hain (with micro-confetti!).
9. **The Ultimate Proposal / Date Question (With Runaway "No" Button!):** 
   - "Will you be my forever Queen & Valentine?"
   - Jab wo **"No"** par cursor le jayengi ya tap karengi, toh **"No" button playful tareeqe se bhaag jayega**!
   - Jab wo **"YES! 💖"** click karengi, toh poori screen par grand confetti cannons, fireworks aur special celebration message pop up hoga!
10. **Quick Edit Mode (⚙️ Top Right):** 
    - Screen par hi button dabakar aap apna aur unka naam, date aur song URL change kar sakte hain.

---

## 🚀 Website Ko Kaise Chalayein? (How to View)

Bas apne computer me `c:\Users\Ayush\Desktop\HTML\Propase` folder kholein aur:
👉 **`index.html` file par double click karein!**  
Yeh aapke kisi bhi browser (Chrome, Edge, Brave, etc.) me turant khul jayegi!

---

## 📸 Apni Real Photos Kaise Add Karein?

Aapke paas **2 aasan tareeqe** hain:

### Tareeqa 1 (Sabse Aasan - Seedha Website Se):
1. Website ko browser me kholein.
2. **"Memory Lane & Polaroids"** section me jayein.
3. **"📸 Add Our New Photo"** button par click karein.
4. Apne computer/mobile se photo select karein, title aur caption likhein, aur "Add To Memory Wall" dabayein! Yeh turant save ho jayegi!

### Tareeqa 2 (Permanent Config File Se):
1. Apni photos ko `assets/images/` folder ke andar copy-paste kar dein (jaise: `photo1.jpg`, `photo2.jpg`).
2. `config.js` file kholein aur `gallery` section me `src` ko update kar dein:
   ```javascript
   {
     title: "Our Goa Trip",
     caption: "The way you smiled here melted my heart ❤️",
     date: "14 Feb 2024",
     src: "assets/images/photo1.jpg",
     tag: "Romantic"
   }
   ```

---

## ✏️ Wife Ka Naam, Anniversary Date & Favorites Kaise Badlein?

Aap `config.js` file ko Notepad ya VS Code me open karke apni pasand ke mutabiq customise kar sakte hain:

1. **Naam & Dates:**
   ```javascript
   couple: {
     husbandName: "Avinash",
     wifeName: "Namita", // <-- Apni wife ka naam
     wifeNickname: "Jaan / Sweetheart",
     anniversaryDate: "2023-01-01T00:00:00", // <-- YYYY-MM-DD format me shaadi/relationship ki date
   }
   ```
2. **Love Letter:**
   `loveLetter` section me jaakar jo paragraphs aap apne dil se kehna chahte hain wo likh sakte hain.
3. **Uski Pasand (Favorites):**
   `herFavorites` section me unka favorite street food, chai, flowers, ya unki funny aadatain edit kar sakte hain.

---

## 🎵 Apni Pasand Ka Romantic Song Kaise Lagayein?

1. Apna favorite MP3 song download karein aur uska naam `song.mp3` rakh kar `assets/audio/` folder me daal dein.
2. `config.js` me `songUrl` ko `"assets/audio/song.mp3"` kar dein.
*(Abhi isme ek royalty-free romantic piano melody default set hai jo automatically play hoti hai)*.

---

## 🌐 Wife Ke Phone Par Kaise Bhejein? (Online Free Hosting)

Agar aap chahte hain ki wo apne phone par ek link khol kar dekhein:
1. **Netlify Drop (1 minute me free link):**
   - [app.netlify.com/drop](https://app.netlify.com/drop) par jayein.
   - Yeh poora `Propase` folder drag & drop kar dein.
   - 10 second me aapko ek live link mil jayegi (jaise: `avinash-and-namita.netlify.app`), jo aap WhatsApp par unhe bhej sakte hain!
2. **Vercel ya GitHub Pages:** Par bhi direct deploy kiya ja sakta hai.
