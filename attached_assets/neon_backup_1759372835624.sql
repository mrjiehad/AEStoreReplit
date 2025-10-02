--
-- PostgreSQL database dump
--

\restrict xnYVUZvsBxtCz4e5m06mCsgvFrLN749IEk50f7zCsKtEtr9h62WUEMuPPXV8UNH

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    password_hash text
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
4e62a3ea-7e1a-40dd-a29e-9f2ac4a69216	70a045ae-5300-40b2-a21e-ad6ddde43385	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	49.99
fb1643cb-03ac-4796-b8c9-d65effea33b6	2c7ab91d-0d40-47e2-8ad4-d1704d3cf949	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
c0de7ea7-c36e-454a-a890-676531e57729	1fcc89f5-bc57-4a7e-8e9c-5ddfc37672ce	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
73155845-ce37-461b-8c5c-b2cfd58131c7	7d54ccd1-89c4-407b-a884-02f40c73614d	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
c70b99ab-9206-4845-b1e5-30218ca4ee29	7d54ccd1-89c4-407b-a884-02f40c73614d	060e1bc5-7071-4c67-b259-600e2d1d4b1a	1	98.00
a22f1c01-75c0-4f5f-a8a4-34bfad63dd7f	95922a7f-982c-446d-81b8-897107e47ae4	6f754174-649f-4c45-892d-af5a55998bc2	1	490.00
671a6aa5-2a9d-4927-aadc-e8e2c54effda	32511b37-51c4-4839-9589-c261d6ee5fa6	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
9ca8ddf3-1515-4cba-81e2-2a6a0451192d	32511b37-51c4-4839-9589-c261d6ee5fa6	1bb3308f-2617-4984-b970-f40771054d6a	1	60.00
8472e626-ac56-4797-9fcf-f2d8a0f0cd03	32511b37-51c4-4839-9589-c261d6ee5fa6	a4b2d530-5115-4fd2-a837-327a8acb0645	1	980.00
2616fb1c-5c4e-4eeb-bae7-18dbfb070f85	a7c548ae-f769-4143-a4a6-fcdb7464e271	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
a4dc209d-2854-4fb1-a321-d670ac1378be	a7c548ae-f769-4143-a4a6-fcdb7464e271	6f754174-649f-4c45-892d-af5a55998bc2	1	490.00
0f04c512-dc2e-4699-82f5-c904476de390	a7c548ae-f769-4143-a4a6-fcdb7464e271	1bb3308f-2617-4984-b970-f40771054d6a	1	60.00
5aa99ce1-3e2a-4e81-9aa6-69b97ed68a17	ce5fa0f8-408a-4706-bcec-766de52b660d	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
6626fa5f-215d-44f6-b8ae-9eaed113f27e	f06042e2-1f8f-4e94-a6d1-ddb5ca7d15ca	6f754174-649f-4c45-892d-af5a55998bc2	1	490.00
5bf00be8-b818-45ea-953a-ee253e482f67	f06042e2-1f8f-4e94-a6d1-ddb5ca7d15ca	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
c1752edd-3ea5-4faf-b615-fe15bc0b0f0f	786c80c7-16c0-4be8-9cee-902c78d89153	6f754174-649f-4c45-892d-af5a55998bc2	1	490.00
31ae4d04-52fb-48e6-95ac-fdc0876306b8	786c80c7-16c0-4be8-9cee-902c78d89153	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
7a0f8a10-6dc1-42f2-bc8a-b178ccba70e7	371e695a-65aa-4458-8606-508fe1ed7803	060e1bc5-7071-4c67-b259-600e2d1d4b1a	1	98.00
a2715928-dc23-4828-8125-24daa786bf02	0d3fc50e-7a4c-457e-a54d-1aac2109d950	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1	295.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, user_id, total_amount, discount_amount, final_amount, status, payment_method, payment_id, coupon_code, created_at, completed_at) FROM stdin;
70a045ae-5300-40b2-a21e-ad6ddde43385	2e2e954a-58d7-4b20-8ca0-041d3207aacf	49.99	0.00	49.99	completed	stripe	pi_3SDFvHRs9zOcnkoy1orFtPmK	\N	2025-10-01 02:38:08.93093	\N
2c7ab91d-0d40-47e2-8ad4-d1704d3cf949	2e2e954a-58d7-4b20-8ca0-041d3207aacf	295.00	0.00	295.00	completed	stripe	pi_3SDGDJRs9zOcnkoy1kf2MPrf	\N	2025-10-01 02:57:29.242248	\N
1fcc89f5-bc57-4a7e-8e9c-5ddfc37672ce	2e2e954a-58d7-4b20-8ca0-041d3207aacf	295.00	0.00	295.00	completed	stripe	pi_3SDGLrRs9zOcnkoy0PGKpD0g	\N	2025-10-01 03:05:30.184521	\N
7d54ccd1-89c4-407b-a884-02f40c73614d	2e2e954a-58d7-4b20-8ca0-041d3207aacf	393.00	0.00	393.00	completed	stripe	pi_3SDGZRRs9zOcnkoy0gUgxmWw	\N	2025-10-01 03:19:27.783414	\N
95922a7f-982c-446d-81b8-897107e47ae4	2e2e954a-58d7-4b20-8ca0-041d3207aacf	490.00	0.00	490.00	completed	stripe	pi_3SDGfnRs9zOcnkoy0BNp345s	\N	2025-10-01 03:25:59.16362	\N
32511b37-51c4-4839-9589-c261d6ee5fa6	2e2e954a-58d7-4b20-8ca0-041d3207aacf	1335.00	0.00	1335.00	completed	stripe	pi_3SDHUcRs9zOcnkoy15vUMoQU	\N	2025-10-01 04:18:30.980736	\N
a7c548ae-f769-4143-a4a6-fcdb7464e271	2e2e954a-58d7-4b20-8ca0-041d3207aacf	845.00	0.00	845.00	completed	stripe	pi_3SDIBmRs9zOcnkoy1iXLmz8z	\N	2025-10-01 05:03:08.422429	\N
ce5fa0f8-408a-4706-bcec-766de52b660d	8e335c81-7108-4448-a539-ee48b5c3e9ae	295.00	0.00	295.00	completed	stripe	pi_3SDIC3Rs9zOcnkoy1goNu1nI	\N	2025-10-01 05:04:07.599082	\N
f06042e2-1f8f-4e94-a6d1-ddb5ca7d15ca	2e2e954a-58d7-4b20-8ca0-041d3207aacf	785.00	0.00	785.00	fulfilled	stripe	pi_3SDKQdRs9zOcnkoy1CRImA6Z	\N	2025-10-01 08:27:22.406133	2025-10-01 08:27:23.589
786c80c7-16c0-4be8-9cee-902c78d89153	2e2e954a-58d7-4b20-8ca0-041d3207aacf	785.00	0.00	785.00	fulfilled	stripe	pi_3SDKS9Rs9zOcnkoy07Wbaneo	\N	2025-10-01 08:27:46.588221	2025-10-01 08:27:47.025
371e695a-65aa-4458-8606-508fe1ed7803	2e2e954a-58d7-4b20-8ca0-041d3207aacf	98.00	0.00	98.00	fulfilled	stripe	pi_3SDNdbRs9zOcnkoy0DkHB3qn	\N	2025-10-01 10:52:11.653166	2025-10-01 10:52:12.599
0d3fc50e-7a4c-457e-a54d-1aac2109d950	8e335c81-7108-4448-a539-ee48b5c3e9ae	295.00	0.00	295.00	fulfilled	stripe	pi_3SDNeDRs9zOcnkoy0k7fwUxf	\N	2025-10-01 10:53:12.294909	2025-10-01 10:53:12.526
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.packages (id, name, description, price, aecoin_amount, codes_per_package, featured, image_url, created_at) FROM stdin;
060e1bc5-7071-4c67-b259-600e2d1d4b1a	AECOIN 1000	Level up your game with this popular package	98.00	1000	1	t	\N	2025-10-01 01:57:41.418265
faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	AECOIN 3000	Become a major player with this premium package	295.00	3000	1	t	\N	2025-10-01 01:57:41.436294
6f754174-649f-4c45-892d-af5a55998bc2	AECOIN 5000	Build your empire with this powerful package	490.00	5000	1	f	\N	2025-10-01 01:57:41.455633
a4b2d530-5115-4fd2-a837-327a8acb0645	AECOIN 10000	The ultimate package for serious players	980.00	10000	1	t	\N	2025-10-01 01:57:41.474582
1bb3308f-2617-4984-b970-f40771054d6a	AECOIN 500	Perfect starter package for new players in Los Santos	50.00	500	1	f	\N	2025-10-01 01:57:41.291912
\.


--
-- Data for Name: pending_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pending_payments (id, user_id, provider, external_id, amount, currency, status, cart_snapshot, coupon_code, metadata, created_at, updated_at) FROM stdin;
cc0bd8fb-cf57-4d14-bb48-39624de11379	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDH1FRs9zOcnkoy0pIHnxjl	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 03:47:58.089588	2025-10-01 03:47:58.089588
1db0d8f7-7792-41dd-829d-a24d8d99679b	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDH1pRs9zOcnkoy1wudyk3g	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 03:48:33.176713	2025-10-01 03:48:33.176713
348ec285-2303-4a66-adc9-4694080aebf2	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDH62Rs9zOcnkoy1sytDjPZ	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 03:52:54.449676	2025-10-01 03:52:54.449676
9817f0f0-f9ea-454e-95e1-f22e97fcc81a	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDH9BRs9zOcnkoy1JkDwum1	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 03:56:09.696463	2025-10-01 03:56:09.696463
008c1c8e-1a0f-4175-b10b-791cbdc35084	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHBmRs9zOcnkoy02MWBVV0	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 03:58:50.838593	2025-10-01 03:58:50.838593
7cf79554-5e31-4655-bba4-143ec3d1d2e0	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHTYRs9zOcnkoy0qWuLrDk	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 04:17:12.871268	2025-10-01 04:17:12.871268
40c5392a-120e-4951-a5c6-ed7ed5d698df	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHTdRs9zOcnkoy1hROZkmo	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 04:17:17.642008	2025-10-01 04:17:17.642008
25716a69-901e-4259-9281-ea97490feda4	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHUARs9zOcnkoy1dvNx0EV	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 04:17:51.026205	2025-10-01 04:17:51.026205
dd67937c-8f50-4e6c-9bbd-7e8d22609213	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHUIRs9zOcnkoy1oHstnsS	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 04:17:58.807362	2025-10-01 04:17:58.807362
15ba643f-d13b-4cd8-8bd3-b853026cde04	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHUcRs9zOcnkoy15vUMoQU	1335.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000},{"packageId":"1bb3308f-2617-4984-b970-f40771054d6a","packageName":"AECOIN 500","quantity":1,"price":"60.00","aecoinAmount":500},{"packageId":"a4b2d530-5115-4fd2-a837-327a8acb0645","packageName":"AECOIN 10000","quantity":1,"price":"980.00","aecoinAmount":10000}]	\N	{"subtotal":"1335.00","discount":"0.00"}	2025-10-01 04:18:18.162992	2025-10-01 04:18:18.162992
7b2136dd-5fa3-40b6-b4c7-6805876ecd0c	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHbcRs9zOcnkoy0ygIsoOP	845.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000},{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"1bb3308f-2617-4984-b970-f40771054d6a","packageName":"AECOIN 500","quantity":1,"price":"60.00","aecoinAmount":500}]	\N	{"subtotal":"845.00","discount":"0.00"}	2025-10-01 04:25:32.951758	2025-10-01 04:25:32.951758
5b79d172-ce27-4785-a2d6-5ffabc204094	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDHlSRs9zOcnkoy0J1aIagX	845.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000},{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"1bb3308f-2617-4984-b970-f40771054d6a","packageName":"AECOIN 500","quantity":1,"price":"60.00","aecoinAmount":500}]	\N	{"subtotal":"845.00","discount":"0.00"}	2025-10-01 04:35:42.659443	2025-10-01 04:35:42.659443
c766d75f-be16-41c8-83dd-e5aa9e41ef16	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDIBmRs9zOcnkoy1iXLmz8z	845.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000},{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"1bb3308f-2617-4984-b970-f40771054d6a","packageName":"AECOIN 500","quantity":1,"price":"60.00","aecoinAmount":500}]	\N	{"subtotal":"845.00","discount":"0.00"}	2025-10-01 05:02:54.748861	2025-10-01 05:02:54.748861
c9189f00-6889-466d-a390-8b5cee394ded	8e335c81-7108-4448-a539-ee48b5c3e9ae	stripe	pi_3SDIC3Rs9zOcnkoy1goNu1nI	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 05:03:11.778022	2025-10-01 05:03:11.778022
1161d9ee-48d2-4319-b044-af93bd516031	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDK0sRs9zOcnkoy18CHwEls	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 06:59:47.056959	2025-10-01 06:59:47.056959
bfc6f71c-e20b-4fcc-b04f-e0d58798b141	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDK2YRs9zOcnkoy16hYPBkb	490.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000}]	\N	{"subtotal":"490.00","discount":"0.00"}	2025-10-01 07:01:30.498728	2025-10-01 07:01:30.498728
4930bf47-759e-4e36-88b6-3c267085179e	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDKS9Rs9zOcnkoy07Wbaneo	785.00	MYR	succeeded	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"785.00","discount":"0.00"}	2025-10-01 07:27:57.758446	2025-10-01 08:27:47.062
e44033c1-31e1-4e0a-a5a4-8f7c81e18bd0	2e2e954a-58d7-4b20-8ca0-041d3207aacf	toyyibpay	x1w7hn6l	785.00	MYR	created	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"785.00","discount":"0.00","externalReferenceNo":"7c82d26a-1901-4b69-bd13-35eab1410414"}	2025-10-01 07:28:45.990857	2025-10-01 07:28:45.990857
c0026654-1e51-4fe6-b9f4-e9dc95f0552b	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDKQdRs9zOcnkoy1CRImA6Z	785.00	MYR	succeeded	[{"packageId":"6f754174-649f-4c45-892d-af5a55998bc2","packageName":"AECOIN 5000","quantity":1,"price":"490.00","aecoinAmount":5000},{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"785.00","discount":"0.00"}	2025-10-01 07:26:23.61328	2025-10-01 08:27:23.642
a5059d79-a7c1-41ae-be53-970b2ce72426	2e2e954a-58d7-4b20-8ca0-041d3207aacf	stripe	pi_3SDNdbRs9zOcnkoy0DkHB3qn	98.00	MYR	succeeded	[{"packageId":"060e1bc5-7071-4c67-b259-600e2d1d4b1a","packageName":"AECOIN 1000","quantity":1,"price":"98.00","aecoinAmount":1000}]	\N	{"subtotal":"98.00","discount":"0.00"}	2025-10-01 10:51:59.543583	2025-10-01 10:52:12.637
bc2efffa-f6e8-452c-a5d4-c4a7aa22b7e8	8e335c81-7108-4448-a539-ee48b5c3e9ae	stripe	pi_3SDNeARs9zOcnkoy1HZzO8fk	295.00	MYR	created	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 10:52:34.844615	2025-10-01 10:52:34.844615
6a5a284b-a44b-48fe-b63e-ed7887db99f6	8e335c81-7108-4448-a539-ee48b5c3e9ae	stripe	pi_3SDNeDRs9zOcnkoy0k7fwUxf	295.00	MYR	succeeded	[{"packageId":"faf371e4-4fa8-4e58-a6fb-b757aaa2cb31","packageName":"AECOIN 3000","quantity":1,"price":"295.00","aecoinAmount":3000}]	\N	{"subtotal":"295.00","discount":"0.00"}	2025-10-01 10:52:38.103746	2025-10-01 10:53:12.561
\.


--
-- Data for Name: player_rankings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.player_rankings (id, user_id, player_name, stars, rank, updated_at) FROM stdin;
d5ebf6e3-1962-4e5f-87df-0994f2717772	2e2e954a-58d7-4b20-8ca0-041d3207aacf	EL ADELIA	7	1	2025-10-01 04:41:39.641231
2fc37071-d1a6-4cda-a0d1-4e2664e0fd23	2e2e954a-58d7-4b20-8ca0-041d3207aacf	FOSYQXS	7	2	2025-10-01 04:41:39.641231
0552013c-c481-4777-87c9-80bf5db02fae	2e2e954a-58d7-4b20-8ca0-041d3207aacf	VAN BEAN	7	3	2025-10-01 04:41:39.641231
c37470bd-40b8-4360-b05b-54e9760e0677	2e2e954a-58d7-4b20-8ca0-041d3207aacf	JOHN VEGA	6	4	2025-10-01 04:41:39.641231
4b684bf0-5dae-4e2d-b218-0b464849cdff	2e2e954a-58d7-4b20-8ca0-041d3207aacf	ALEX STORM	6	5	2025-10-01 04:41:39.641231
87493e06-ce82-40e8-849b-240272dd7059	2e2e954a-58d7-4b20-8ca0-041d3207aacf	MIKE ROSS	5	6	2025-10-01 04:41:39.641231
682b703d-06d2-468f-ae67-b76ce020e623	2e2e954a-58d7-4b20-8ca0-041d3207aacf	SARAH CONNOR	5	7	2025-10-01 04:41:39.641231
470f93fe-cce5-4f52-931a-d913267dfe40	2e2e954a-58d7-4b20-8ca0-041d3207aacf	JACK REAPER	4	8	2025-10-01 04:41:39.641231
89c1c19e-2402-4dbb-be03-064737bf1fd4	2e2e954a-58d7-4b20-8ca0-041d3207aacf	LUNA NIGHT	4	9	2025-10-01 04:41:39.641231
60b87bd8-04c6-49b1-ae83-384d4eeba38e	2e2e954a-58d7-4b20-8ca0-041d3207aacf	RAZOR EDGE	3	10	2025-10-01 04:41:39.641231
\.


--
-- Data for Name: redemption_codes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.redemption_codes (id, code, package_id, order_id, status, redeemed_at, created_at, expires_at) FROM stdin;
dbc21ef5-1a9c-415f-b174-9b2b05fa0d5f	BGQQ-JRDP-CRFU-V8P7	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	70a045ae-5300-40b2-a21e-ad6ddde43385	active	\N	2025-10-01 02:38:08.99985	\N
78407c75-1ea2-4752-a2fb-a8933059c5bc	E8DY-RAGG-NNSA-B4DE	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	2c7ab91d-0d40-47e2-8ad4-d1704d3cf949	active	\N	2025-10-01 02:57:29.29943	\N
b1733738-7d41-4c5d-b332-83702d4ebe0c	NEMP-76XU-MSTF-J6XA	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	1fcc89f5-bc57-4a7e-8e9c-5ddfc37672ce	active	\N	2025-10-01 03:05:30.24208	\N
f3d7518a-3fe2-40eb-b520-81d8bc47e3f9	X38Q-U573-5U4X-32BW	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	7d54ccd1-89c4-407b-a884-02f40c73614d	active	\N	2025-10-01 03:19:27.841408	\N
9594b371-dd4b-45d5-b831-806e61aee7b8	3D5G-2H2U-JGG9-EVFE	060e1bc5-7071-4c67-b259-600e2d1d4b1a	7d54ccd1-89c4-407b-a884-02f40c73614d	active	\N	2025-10-01 03:19:28.769399	\N
205fa722-6189-4717-9551-544caf9ee42e	6WQJ-DVZN-C62Z-UZNR	6f754174-649f-4c45-892d-af5a55998bc2	95922a7f-982c-446d-81b8-897107e47ae4	active	\N	2025-10-01 03:25:59.224826	\N
bfa4df4c-80f5-4217-bfee-4659419d896e	FJGJ-44GU-MN5D-NGX8	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	32511b37-51c4-4839-9589-c261d6ee5fa6	active	\N	2025-10-01 04:18:31.034676	\N
1c33747e-ff68-4e15-ad75-323b8853ef71	L99Z-E2DW-2YEW-NPWG	1bb3308f-2617-4984-b970-f40771054d6a	32511b37-51c4-4839-9589-c261d6ee5fa6	active	\N	2025-10-01 04:18:32.000676	\N
a93788d6-f427-4325-a1a1-4153bf5587dc	CYED-G9W6-8HVB-FAW6	a4b2d530-5115-4fd2-a837-327a8acb0645	32511b37-51c4-4839-9589-c261d6ee5fa6	active	\N	2025-10-01 04:18:32.419479	\N
aafeba05-f202-472e-96f0-903cf1892be4	ETG6-3XW7-EGVJ-RY85	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	a7c548ae-f769-4143-a4a6-fcdb7464e271	active	\N	2025-10-01 05:03:08.485777	\N
76474ab1-0523-4508-a61f-d3d5de42324b	9HXJ-Q57N-E3D8-8ZZ8	6f754174-649f-4c45-892d-af5a55998bc2	a7c548ae-f769-4143-a4a6-fcdb7464e271	active	\N	2025-10-01 05:03:09.418151	\N
2e517049-a1e1-4b2f-aed8-2b7809e7f4c8	FQ78-P26L-XSCS-QY5L	1bb3308f-2617-4984-b970-f40771054d6a	a7c548ae-f769-4143-a4a6-fcdb7464e271	active	\N	2025-10-01 05:03:09.646778	\N
5861457b-7dda-4675-b4ea-714b29a1e259	ED8U-JLKA-LNYL-TRNL	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	ce5fa0f8-408a-4706-bcec-766de52b660d	active	\N	2025-10-01 05:04:07.653598	\N
13854f19-36f3-4bce-97ad-5273aae8e273	82B5-EABA-3A4A-D0A0	6f754174-649f-4c45-892d-af5a55998bc2	f06042e2-1f8f-4e94-a6d1-ddb5ca7d15ca	active	\N	2025-10-01 08:27:22.481911	\N
2f10fa67-0a5a-478f-97a9-b1b038ea4e0f	FCC4-6F06-8338-8087	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	f06042e2-1f8f-4e94-a6d1-ddb5ca7d15ca	active	\N	2025-10-01 08:27:23.409517	\N
33fe5e8a-e0d4-49bc-9ea7-7acd7da4679a	A80F-B0FC-9F1C-8DA6	6f754174-649f-4c45-892d-af5a55998bc2	786c80c7-16c0-4be8-9cee-902c78d89153	active	\N	2025-10-01 08:27:46.633313	\N
68df97fb-fab4-470c-9684-9c33dc94187c	724B-1ECF-6B71-AAB4	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	786c80c7-16c0-4be8-9cee-902c78d89153	active	\N	2025-10-01 08:27:46.842716	\N
d1743c53-5096-431b-b321-a8aa24bc93fb	5F41-22C1-AF82-C09C	060e1bc5-7071-4c67-b259-600e2d1d4b1a	371e695a-65aa-4458-8606-508fe1ed7803	active	\N	2025-10-01 10:52:11.696921	\N
38b898f3-fdf8-4bd1-8195-d9d6c8e3fb36	1731-E4A7-A166-935C	faf371e4-4fa8-4e58-a6fb-b757aaa2cb31	0d3fc50e-7a4c-457e-a54d-1aac2109d950	active	\N	2025-10-01 10:53:12.33998	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, discord_id, email, username, avatar, created_at, is_admin, password_hash) FROM stdin;
2e2e954a-58d7-4b20-8ca0-041d3207aacf	983369856684531735	abhamidtv@gmail.com	trace_boy	\N	2025-10-01 02:03:43.151203	f	\N
8e335c81-7108-4448-a539-ee48b5c3e9ae	822166046529945600	irsyadabdul579@gmail.com	aleesyahusbaby	https://cdn.discordapp.com/avatars/822166046529945600/ce5f390149861128b9e4c836ae8ca24f.png	2025-10-01 05:02:46.715094	f	\N
eb5787b0-9ed5-4e5c-be9a-7810b08f6640	\N	admin@aeofficial.my	admin	\N	2025-10-01 07:44:19.417562	t	$2b$12$xR1A1Og0AelV/qrH6zOb.ODkRi7OXAvsoBNMAk.6doykx9wgIjmNK
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
-- Name: pending_payments pending_payments_external_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pending_payments
    ADD CONSTRAINT pending_payments_external_id_key UNIQUE (external_id);


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
-- Name: users_username_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_username_unique ON public.users USING btree (username);


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
-- Name: pending_payments pending_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pending_payments
    ADD CONSTRAINT pending_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: player_rankings player_rankings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.player_rankings
    ADD CONSTRAINT player_rankings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict xnYVUZvsBxtCz4e5m06mCsgvFrLN749IEk50f7zCsKtEtr9h62WUEMuPPXV8UNH

