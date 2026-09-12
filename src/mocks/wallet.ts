import { UserTransaction, WalletBalance } from '../types';

export const initialWalletBalance: WalletBalance = {
  total: 50.0,
  withdrawable: 40.0,
  bonus: 10.0,
};

export const initialTransactions: UserTransaction[] = [
  {
    id: 'TRX-998A21',
    type: 'prize',
    title: 'Prêmio BIG 10',
    date: 'Hoje, 10:15',
    value: 32.5,
    status: 'success',
  },
  {
    id: 'TRX-871B04',
    type: 'bet',
    title: 'Aposta Mesa #02',
    date: 'Hoje, 09:30',
    value: -10.0,
    status: 'success',
  },
  {
    id: 'TRX-422C99',
    type: 'deposit',
    title: 'Depósito Pix Instantâneo',
    date: 'Ontem, 14:20',
    value: 27.5,
    status: 'success',
  },
  {
    id: 'TRX-112D45',
    type: 'withdraw',
    title: 'Saque Pix Solicitado',
    date: '10 Ago, 18:00',
    value: -50.0,
    status: 'success',
    pixKeyType: 'CPF',
    pixKey: '***.458.912-**',
  },
];
