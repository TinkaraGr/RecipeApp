# 🍽️ Aplikacija - Moja kuharska knjiga

---

## 🧩 Opis projekta

Aplikacija je namenjena uporabnikom, ki želijo:  
- dodajati in urejati recepte,  
- imeti vse svoje recepte na enem mestu,  
- uporabljati preprost in pregleden uporabniški vmesnik.  

Projekt je razvit kot **frontend aplikacija v Angularju**, povezan z **Express.js backendom**, ter oblikovan z uporabo **Bootstrap** knjižnice.

---

## 🛠️ Uporabljene tehnologije

- **Angular** (frontend)  
- **Express.js** (backend)  
- **Bootstrap**  
- **HTML / CSS / TypeScript / Node.js**

---

## 🔌 Backend strežnik

Backend strežnik skrbi za:

- Avtentikacijo uporabnikov (prijava, registracija)  
- Upravljanje receptov (CRUD operacije: Create, Read, Update, Delete)  
- Shranjevanje podatkov v **lokalno JSON “bazo”**  

Zaženi strežnik:
```
node server.js
```
---
## ▶️ Zagon frontend aplikacije

Namesti odvisnosti Angular projekta:
```
npm install
```

Zaženi Angular aplikacijo (uporablja proxy, da kliče Express API):
```
ng serve --open
```
---
## 🔑 Prijava v aplikacijo

Spletna stran je zaščitena s prijavnim sistemom.
Za namen pregleda projekta so na voljo testni podatki:

E-mail: user@gmail.com
Geslo: user123

