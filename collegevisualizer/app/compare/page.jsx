import { getAllSchools } from '../../lib/schools';
import CompareClient from './CompareClient';

export const metadata = {
  title: 'Compare Colleges Side-by-Side',
  description: 'Compare up to 4 U.S. colleges side-by-side. See acceptance rates, tuition, SAT scores, graduation rates, and earnings all at once.',
};

export default function ComparePage() {
  const schools = getAllSchools();
  // Pass only fields needed for compare (not full demographic data)
  const slim = schools.map(s => ({
    id: s.id, name: s.name, display_name: s.display_name,
    city: s.city, state: s.state, control: s.control,
    adm: s.adm, sat: s.sat, act: s.act, size: s.size,
    grad_rate: s.grad_rate, tuit_in: s.tuit_in, tuit_out: s.tuit_out,
    npt_pub: s.npt_pub, npt_priv: s.npt_priv, debt: s.debt,
    earn6: s.earn6, earn10: s.earn10, women: s.women,
    app: s.app,
  }));
  return <CompareClient schools={slim} />;
}
