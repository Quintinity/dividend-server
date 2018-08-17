create table if not exists Dividend(
    symbol text primary key not null,
    amount real not null,
    ex_date text not null,
    payment_date text not null,
    currency text not null
);

create table if not exists User(
    id text primary key not null,
    auth_key text not null
);