import { Award, Lock } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';

const achievements = [
  { title: 'Racha 10 dias', state: 'desbloqueado', detail: 'Mantuviste actividad 10 dias seguidos.' },
  { title: 'Tipster preciso', state: 'en progreso', detail: '7 de 10 predicciones acertadas.' },
  { title: 'Logro secreto', state: 'secreto', detail: 'Se revela al cumplir la condicion.' },
];

export default function AchievementsTab() {
  return (
    <div className="space-y-3">
      {achievements.map((achievement) => (
        <Card key={achievement.title} className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-bg-tertiary">
            {achievement.state === 'secreto' ? <Lock className="h-4 w-4 text-text-tertiary" /> : <Award className="h-4 w-4 text-warning" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-text-primary">{achievement.title}</p>
            <p className="text-sm text-text-secondary">{achievement.detail}</p>
          </div>
          <Badge variant={achievement.state === 'desbloqueado' ? 'success' : 'default'}>{achievement.state}</Badge>
        </Card>
      ))}
    </div>
  );
}
