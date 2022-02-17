-- Útfæra test gögn
TRUNCATE TABLE events CASCADE;
insert into events (name, slug, description) values ('Hönnuðahittingur í mars', 'honnudahittingur-i-mars', 'Hönnuðir hittast og skemmta sér! Mætið með blað og blýant og hannið hús.');
insert into events (name, slug, description) values ('Forritara takeover', 'forritar-takeover', 'Forritarar taka yfir HÍ! Ert þú þreyttur á oki annarra greina? Ætti eingöngu að kenna forritun og ekkert annað? Komdu þá með okkur!');
insert into events (name, slug, description) values ('Kaffiboð hjá Súkka og Mikka', 'kaffibod-hja-sukka-og-mikka', 'Súkki og Mikki bjóða nemendum Vef 2 í kaffiboð. Tækifæri fyrir nemendur til að kynnast dæmatímakennurum sínum yfir kaffi og kleinum.');
insert into events (name, slug, description) values ('Sálgreining Marcelo', 'salgreining-marcelo', 'Marcelo fer í naflaskoðun og sálgreinir sjálfan sig, á sviði fyrir framan áhorfendur!');
