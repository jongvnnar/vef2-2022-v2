# Vefforritun 2, 2022. Verkefni 2: Viðburðakerfi

Notandi að síðu stjórnenda er 'admin' og password hans 'password'

## Vefsíða
Verkefnið keyrir á vefsíðunni https://jgh-vef2-verk2.herokuapp.com/

## Keyrsla
### Að setja upp gagnagrunn:
Notast skal við postgres gagnagrunn, uppsetningarupplýsingar má finna [hér](https://github.com/vefforritun/vef2-2022/blob/main/namsefni/09.postgres/postgres-tenging.md).

### Uppsetning env file:
.env file skal innihalda:
```
DATABASE_URL=url_a_gagnagrunn
SESSION_SECRET=adflo2iqu5l2klkdaslkjoq2uiljlkweflkjaefijaslzjbd
```
### Uppsetning gagnagrunna:
Til að setja upp gagnagrunna með gögnum uppsettum skal keyra `npm run setup` eða `npm run build`.

### Keyra upp vefsíðu
Eftir að allt hefur verið sett upp má keyra upp vefsíðu með 
```
npm run start
```

## Lint og prettier
Eslint og stylelint er sett upp, hægt að keyra með:
```
npm run lint:eslint
npm run lint:stylelint
```
eða einfaldlega 
```
npm run lint
```
Prettier er einnig sett upp. Hægt er að keyra með:
```
npm run prettier
```

## Test
.env.test file er í github repo, en þarf hef ég skýrt test gagnagrunninn test sem hægt er að fá aðgang að með notandanum 'notandi' sem hefur passwordið 'password'. Þessu má breyta.

Test eru keyrð með:
```
npm run test
```
