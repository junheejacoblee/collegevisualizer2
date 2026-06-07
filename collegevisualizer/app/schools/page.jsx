import { getAllSchools } from '../../lib/schools';
import { toSlug } from '../../lib/utils';
import BrowseClient from './BrowseClient';

export const metadata = {
  title: 'Browse U.S. Colleges & Universities',
  description: 'Browse and filter 1,400+ top U.S. colleges by state, type, size, acceptance rate, SAT scores, and earnings.',
};

export default function SchoolsPage() {
  const schools = getAllSchools();
  // Only pass fields needed for the browse table — reduces serialized payload
  const slim = schools.map(s => ({
    id: s.id,
    name: s.name,
    display_name: s.display_name,
    city: s.city,
    state: s.state,
    control: s.control,
    adm: s.adm,
    sat: s.sat,
    earn10: s.earn10,
    earn6: s.earn6,
    size: s.size,
    grad_rate: s.grad_rate,
    npt_pub: s.npt_pub,
    npt_priv: s.npt_priv,
    debt: s.debt,
    tuit_in: s.tuit_in,
    tuit_out: s.tuit_out,
  }));
  return <BrowseClient schools={slim} />;
}
