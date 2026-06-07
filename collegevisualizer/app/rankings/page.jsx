import { getAllSchools, toSlug, safeNum, fmt, ownerLabel, getDisplayName } from '../../lib/schools';
import RankingsClient from './RankingsClient';

export const metadata = {
  title: 'College Rankings — Top Earners, Most Selective, Best Value',
  description: 'Rankings of top U.S. colleges by post-graduation earnings, acceptance rate, graduation rate, average SAT scores, and best value net price.',
};

export default function RankingsPage() {
  const schools = getAllSchools();

  const build = (cat) => {
    let sorted;
    switch (cat) {
      case 'earnings':  sorted = schools.filter(s => safeNum(s.earn10) > 0).sort((a,b) => b.earn10 - a.earn10); break;
      case 'selective': sorted = schools.filter(s => safeNum(s.adm) > 0 && s.adm < 0.5).sort((a,b) => a.adm - b.adm); break;
      case 'value':     sorted = schools.filter(s => (safeNum(s.npt_pub)??safeNum(s.npt_priv)) > 0).sort((a,b) => (safeNum(a.npt_pub)??safeNum(a.npt_priv))-(safeNum(b.npt_pub)??safeNum(b.npt_priv))); break;
      case 'grad':      sorted = schools.filter(s => safeNum(s.grad_rate) > 0).sort((a,b) => b.grad_rate - a.grad_rate); break;
      case 'sat':       sorted = schools.filter(s => safeNum(s.sat) > 0).sort((a,b) => b.sat - a.sat); break;
      case 'debt':      sorted = schools.filter(s => safeNum(s.debt) > 0).sort((a,b) => a.debt - b.debt); break;
      default: sorted = [];
    }
    return sorted.slice(0, 30).map(s => ({
      id: s.id, name: getDisplayName(s), city: s.city, state: s.state, control: s.control, slug: toSlug(getDisplayName(s)),
      adm: safeNum(s.adm), sat: safeNum(s.sat), earn10: safeNum(s.earn10),
      grad_rate: safeNum(s.grad_rate), debt: safeNum(s.debt),
      npt: safeNum(s.npt_pub) ?? safeNum(s.npt_priv),
    }));
  };

  const data = {
    earnings: build('earnings'),
    selective: build('selective'),
    value: build('value'),
    grad: build('grad'),
    sat: build('sat'),
    debt: build('debt'),
  };

  return <RankingsClient data={data} />;
}
