import { NextResponse } from 'next/server';

export async function GET() {
  const kpis = {
    activeProjects: {
      value: 5,
      change: '+12%',
      trend: 'up',
      detail: '5 projets en cours de livraison'
    },
    monthlyDeliverables: {
      value: 18,
      change: '+25%',
      trend: 'up',
      detail: '18 livrables validés ce mois'
    },
    budgetVariance: {
      value: '+4.2%',
      change: '-1.5%',
      trend: 'down',
      detail: 'Budget maîtrisé dans les normes'
    },
    teamWorkload: {
      value: '78%',
      change: '+5%',
      trend: 'up',
      detail: 'Charge de travail équilibrée'
    },
    sprintVelocity: {
      value: '42 pts',
      change: '+8%',
      trend: 'up',
      detail: 'Vélocité moyenne des sprints'
    },
    globalHealthScore: {
      value: '88/100',
      change: '+3 pts',
      trend: 'up',
      detail: 'Indice global de performance'
    }
  };

  return NextResponse.json(kpis);
}
