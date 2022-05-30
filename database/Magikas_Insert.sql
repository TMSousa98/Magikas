insert into card (crd_name, crd_description) values('Dark','Dark consumes Forest and Water');
insert into card (crd_name, crd_description) values('Light','Light destroys Dark and Fire');
insert into card (crd_name, crd_description) values('Forest','Forest absorbs Light and Water');
insert into card (crd_name, crd_description) values('Water','Water beats Fire and eats Light');
insert into card (crd_name, crd_description) values('Fire','Fire burns Forest and lights Dark');

insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(3,2);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(2,1);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(1,4);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(4,5);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(5,3);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(3,4);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(4,2);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(2,5);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(5,1);
insert into cardwcard (cwc_cwins_id, cwc_clooses_id) values(1,3);

insert into match (mt_turn, mt_finished)
values (0, false);

insert into pmstate (pms_name)
values ('PlayCard');
insert into pmstate (pms_name)
values ('Attack');
insert into pmstate (pms_name)
values ('Endturn');
insert into pmstate (pms_name)
values ('Wait');

insert into playermatch (pm_player_id, pm_match_id, pm_state_id, pm_hp)
values (1, 1, 1, 3);
insert into playermatch (pm_player_id, pm_match_id, pm_state_id, pm_hp)
values (2, 1, 4, 3);

insert into cardpos (cp_name)
values ('Hand');
insert into cardpos (cp_name)
values ('Table');
insert into cardpos (cp_name)
values ('TablePlayed');

insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (1, 1, 1, true);
insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (1, 1, 3, true);
insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (1, 1, 1, true);
insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (2, 1, 2, true);
insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (2, 1, 5, true);
insert into deck (deck_pm_id, deck_pos_id, deck_card_id, deck_card_alive)
values (2, 1, 3, true;

commit;
