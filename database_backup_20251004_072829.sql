--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cart_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    package_id character varying NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cart_items OWNER TO neondb_owner;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.coupons (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    discount_type text NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    min_purchase numeric(10,2) DEFAULT '0'::numeric,
    max_uses integer,
    current_uses integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.coupons OWNER TO neondb_owner;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.order_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    order_id character varying NOT NULL,
    package_id character varying NOT NULL,
    quantity integer NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO neondb_owner;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    discount_amount numeric(10,2) DEFAULT '0'::numeric,
    final_amount numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text NOT NULL,
    payment_id text,
    coupon_code text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    completed_at timestamp without time zone
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: packages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.packages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    aecoin_amount integer NOT NULL,
    codes_per_package integer DEFAULT 1 NOT NULL,
    featured boolean DEFAULT false,
    image_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.packages OWNER TO neondb_owner;

--
-- Name: pending_payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pending_payments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    provider text NOT NULL,
    external_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'MYR'::text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    cart_snapshot text NOT NULL,
    coupon_code text,
    metadata text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pending_payments OWNER TO neondb_owner;

--
-- Name: player_rankings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.player_rankings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    player_name text NOT NULL,
    stars integer DEFAULT 0 NOT NULL,
    rank integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.player_rankings OWNER TO neondb_owner;

--
-- Name: redemption_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.redemption_codes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    package_id character varying NOT NULL,
    order_id character varying NOT NULL,
    aecoin_amount integer NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    redeemed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    expires_at timestamp without time zone
);


ALTER TABLE public.redemption_codes OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    discord_id character varying,
    email text NOT NULL,
    username text NOT NULL,
    avatar text,
    password_hash text,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cart_items (id, user_id, package_id, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.coupons (id, code, discount_type, discount_value, min_purchase, max_uses, current_uses, is_active, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (id, order_id, package_id, quantity, price_at_purchase) FROM stdin;
d9c1d151-7192-41bf-917c-d1a551b13424	d33c36c6-db1f-49b6-8099-d242afb0aa02	b4aa2e90-ee6a-4b9d-a4d0-3308138874e2	1	98.00
10853f16-7094-4df3-8ba5-f225f37b0826	d33c36c6-db1f-49b6-8099-d242afb0aa02	c3200cfe-b5fa-42c3-bebc-e0ea25a848c4	1	295.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, user_id, total_amount, discount_amount, final_amount, status, payment_method, payment_id, coupon_code, created_at, completed_at) FROM stdin;
d33c36c6-db1f-49b6-8099-d242afb0aa02	32994d9e-e32c-4527-93bd-3ec1ca742f30	393.00	0.00	393.00	fulfilled	stripe	pi_3SENQORs9zOcnkoy1RkaRykX	\N	2025-10-04 04:50:46.630737	2025-10-04 04:50:48.118
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.packages (id, name, description, price, original_price, aecoin_amount, codes_per_package, featured, image_url, created_at) FROM stdin;
02961047-a873-4f13-bd52-d1e370a4f29c	AECOIN 500	Perfect starter package for new players in Los Santos	50.00	60.00	500	1	f	/attached_assets/COINS1_1759562148670.jpg	2025-10-04 04:07:01.505569
b4aa2e90-ee6a-4b9d-a4d0-3308138874e2	AECOIN 1000	Level up your game with this popular package	98.00	110.00	1000	1	t	/attached_assets/COINS2_1759562148673.jpg	2025-10-04 04:07:01.582094
c3200cfe-b5fa-42c3-bebc-e0ea25a848c4	AECOIN 3000	Become a major player with this premium package	295.00	310.00	3000	1	t	/attached_assets/COINS3_1759562148676.jpg	2025-10-04 04:07:01.641751
9aaa5836-8d3f-4e1e-82c6-d1a7a6c427d1	AECOIN 5000	Build your empire with this powerful package	490.00	510.00	5000	1	f	/attached_assets/COINS4_1759562148677.jpg	2025-10-04 04:07:01.702859
ced4ba41-6cb5-4046-8647-f7adf78cf2ef	AECOIN 10000	The ultimate package for serious players	980.00	1010.00	10000	1	t	/attached_assets/COINS5_1759562148678.jpg	2025-10-04 04:07:01.763986
\.


--
-- Data for Name: pending_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pending_payments (id, user_id, provider, external_id, amount, currency, status, cart_snapshot, coupon_code, metadata, created_at, updated_at) FROM stdin;
b5b0cd0c-1967-429e-a0cb-91c08f3ee22b	32994d9e-e32c-4527-93bd-3ec1ca742f30	stripe	pi_3SENQORs9zOcnkoy1RkaRykX	393.00	MYR	succeeded	[{"packageId":"b4aa2e90-ee6a-4b9d-a4d0-3308138874e2","packageName":"AECOIN 1000","quantity":1,"price":"98.00","aecoinAmount":1000},{"packageId":"c3200cfe-b5fa-42c3-bebc-e0ea25a848c4","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"393.00","discount":"0.00"}	2025-10-04 04:50:28.729622	2025-10-04 04:50:48.242
\.


--
-- Data for Name: player_rankings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.player_rankings (id, user_id, player_name, stars, rank, updated_at) FROM stdin;
28fce40f-5c56-469d-9ef8-bcddb70fdaa3	70718261-fd3e-4586-8e5f-c8ff89407c87	El_AQELIA	10	1	2025-10-04 04:56:17.303898
00bfcaa6-c565-473a-96c2-09c038aed57f	ef4cba93-7db8-4f31-9162-b54c7967d372	FSPOONSS	9	2	2025-10-04 04:56:17.303898
7d6a4728-91c9-4215-82c7-5d49cb3bf633	a38b8e50-dc60-43ca-a23b-c0d85f6993ba	Yani Bejan	8	3	2025-10-04 04:56:17.303898
60cdc382-3640-4b91-b8c3-f90571d1689d	0a827c04-c795-44f2-9d0e-f94cf87c9449	Shadow_Wolf	7	4	2025-10-04 04:56:17.303898
5f15bdf3-a447-4a8b-8cc4-5798c8c47f14	125ef134-5287-4eb0-8cbc-01249badd6f3	NeonRider	6	5	2025-10-04 04:56:17.303898
ed048251-6af2-4931-99b6-f937eeffab20	470258b0-d367-4c5d-bb32-d1f6a9e11189	Phoenix_King	5	6	2025-10-04 04:56:17.303898
15e23411-73cc-40a4-8422-0dd31dcfcb1e	7da1b856-0197-4414-8d98-5aa726e85fd7	Ice_Breaker	4	7	2025-10-04 04:56:17.303898
de76fa48-476d-4e5c-b24e-0045a2f7abbb	ab43fcea-6438-4893-b55b-4924105342aa	Thunder_Strike	3	8	2025-10-04 04:56:17.303898
98c22346-c1d6-47d1-83ca-e30dfd30a0d6	a70523b7-d7be-4dc6-8045-48e2dc770440	Viper_Alpha	2	9	2025-10-04 04:56:17.303898
81b0cfd9-4212-4522-a359-5e0d7f20defd	fdbbb8da-252d-4e9f-9d77-9e609f1a038f	Ghost_Reaper	1	10	2025-10-04 04:56:17.303898
\.


--
-- Data for Name: redemption_codes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.redemption_codes (id, code, package_id, order_id, aecoin_amount, status, redeemed_at, created_at, expires_at) FROM stdin;
765c0a07-a78d-4b71-abdc-c060bf63a853	AE1000-ZVGX-JNTA-BYRY	b4aa2e90-ee6a-4b9d-a4d0-3308138874e2	d33c36c6-db1f-49b6-8099-d242afb0aa02	1000	active	\N	2025-10-04 04:50:46.819992	\N
87897b14-727b-438f-a008-aafb686f2a55	AE3000-NERS-FZQU-EMGC	c3200cfe-b5fa-42c3-bebc-e0ea25a848c4	d33c36c6-db1f-49b6-8099-d242afb0aa02	3000	active	\N	2025-10-04 04:50:47.917806	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, discord_id, email, username, avatar, password_hash, is_admin, created_at) FROM stdin;
32994d9e-e32c-4527-93bd-3ec1ca742f30	983369856684531735	abhamidtv@gmail.com	trace_boy	https://cdn.discordapp.com/avatars/983369856684531735/45c68f9540a2b1f4c002f966fe73844f.png	\N	f	2025-10-04 04:45:46.753793
70718261-fd3e-4586-8e5f-c8ff89407c87	sample_discord_1	el.aqelia@example.com	El_AQELIA	https://cdn.discordapp.com/embed/avatars/0.png	\N	f	2025-10-04 04:56:02.84664
ef4cba93-7db8-4f31-9162-b54c7967d372	sample_discord_2	fspoonss@example.com	FSPOONSS	https://cdn.discordapp.com/embed/avatars/1.png	\N	f	2025-10-04 04:56:02.84664
a38b8e50-dc60-43ca-a23b-c0d85f6993ba	sample_discord_3	yani.bejan@example.com	Yani Bejan	https://cdn.discordapp.com/embed/avatars/2.png	\N	f	2025-10-04 04:56:02.84664
0a827c04-c795-44f2-9d0e-f94cf87c9449	sample_discord_4	player4@example.com	Shadow_Wolf	https://cdn.discordapp.com/embed/avatars/3.png	\N	f	2025-10-04 04:56:02.84664
125ef134-5287-4eb0-8cbc-01249badd6f3	sample_discord_5	player5@example.com	NeonRider	https://cdn.discordapp.com/embed/avatars/4.png	\N	f	2025-10-04 04:56:02.84664
470258b0-d367-4c5d-bb32-d1f6a9e11189	sample_discord_6	player6@example.com	Phoenix_King	https://cdn.discordapp.com/embed/avatars/5.png	\N	f	2025-10-04 04:56:02.84664
7da1b856-0197-4414-8d98-5aa726e85fd7	sample_discord_7	player7@example.com	Ice_Breaker	https://cdn.discordapp.com/embed/avatars/0.png	\N	f	2025-10-04 04:56:02.84664
ab43fcea-6438-4893-b55b-4924105342aa	sample_discord_8	player8@example.com	Thunder_Strike	https://cdn.discordapp.com/embed/avatars/1.png	\N	f	2025-10-04 04:56:02.84664
a70523b7-d7be-4dc6-8045-48e2dc770440	sample_discord_9	player9@example.com	Viper_Alpha	https://cdn.discordapp.com/embed/avatars/2.png	\N	f	2025-10-04 04:56:02.84664
fdbbb8da-252d-4e9f-9d77-9e609f1a038f	sample_discord_10	player10@example.com	Ghost_Reaper	https://cdn.discordapp.com/embed/avatars/3.png	\N	f	2025-10-04 04:56:02.84664
\.


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_unique UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_payment_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- Name: pending_payments pending_payments_external_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pending_payments
    ADD CONSTRAINT pending_payments_external_id_unique UNIQUE (external_id);


--
-- Name: pending_payments pending_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pending_payments
    ADD CONSTRAINT pending_payments_pkey PRIMARY KEY (id);


--
-- Name: player_rankings player_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_rankings
    ADD CONSTRAINT player_rankings_pkey PRIMARY KEY (id);


--
-- Name: redemption_codes redemption_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redemption_codes
    ADD CONSTRAINT redemption_codes_code_unique UNIQUE (code);


--
-- Name: redemption_codes redemption_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redemption_codes
    ADD CONSTRAINT redemption_codes_pkey PRIMARY KEY (id);


--
-- Name: users users_discord_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_discord_id_unique UNIQUE (discord_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: cart_items cart_items_package_id_packages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_package_id_packages_id_fk FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_package_id_packages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_package_id_packages_id_fk FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: pending_payments pending_payments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pending_payments
    ADD CONSTRAINT pending_payments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: player_rankings player_rankings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_rankings
    ADD CONSTRAINT player_rankings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: redemption_codes redemption_codes_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redemption_codes
    ADD CONSTRAINT redemption_codes_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: redemption_codes redemption_codes_package_id_packages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.redemption_codes
    ADD CONSTRAINT redemption_codes_package_id_packages_id_fk FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

