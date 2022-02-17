-- Útfæra test gögn
TRUNCATE TABLE events CASCADE;
insert into events (name, slug, description) values ('Hönnuðahittingur í mars', 'honnudahittingur-i-mars', 'Hönnuðir hittast og skemmta sér! Mætið með blað og blýant og hannið hús.');
insert into events (name, slug, description) values ('Forritara takeover', 'forritar-takeover', 'Forritarar taka yfir HÍ! Ert þú þreyttur á oki annarra greina? Ætti eingöngu að kenna forritun og ekkert annað? Komdu þá með okkur!');
insert into events (name, slug, description) values ('Kaffiboð hjá Súkka og Mikka', 'kaffibod-hja-sukka-og-mikka', 'Súkki og Mikki bjóða nemendum Vef 2 í kaffiboð. Tækifæri fyrir nemendur til að kynnast dæmatímakennurum sínum yfir kaffi og kleinum.');
insert into events (name, slug, description) values ('Sálgreining Marcelo', 'salgreining-marcelo', 'Marcelo fer í naflaskoðun og sálgreinir sjálfan sig, á sviði fyrir framan áhorfendur!');

TRUNCATE TABLE bookings;
insert into bookings (name, comment, event) values ('Jón', 'svo spenntur!', 1);
insert into bookings (name, comment, event) values ('Jón', 'ÞEtta verður geggjað', 2);
insert into bookings (name, comment, event) values ('Jón', 'Ekkert voða spenntur en jæja', 3);
insert into bookings (name, comment, event) values ('Jón', 'lit', 4);
insert into bookings (name, comment, event) values ('Gunnar', 'vá', 1);
insert into bookings (name, comment, event) values ('Gunnar', 'snoilld', 2);
insert into bookings (name, comment, event) values ('Gunnar', 'brooklyn 99  var að klarast    ', 3);
insert into bookings (name, comment, event) values ('Gunnar', 'test', 4);
insert into bookings (name, comment, event) values ('Arnar', 'ssadkj', 1);
insert into bookings (name, comment, event) values ('Arnar', 'eg kanne kki að sk r fi a', 2);
insert into bookings (name, comment, event) values ('Arnar', 'spenntur!', 3);
insert into bookings (name, comment, event) values ('Arnar', 'vá', 4);
insert into bookings (name, comment, event) values ('Björn', 'eg er bjorn', 1);
insert into bookings (name, comment, event) values ('Björn', 'eg er svo spenntur', 2);
insert into bookings (name, comment, event) values ('Björn', 'geggjað event', 3);
insert into bookings (name, comment, event) values ('Björn', 'lit', 4);

