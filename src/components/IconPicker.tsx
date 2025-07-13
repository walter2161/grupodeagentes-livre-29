
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, Heart, Brain, Baby, Briefcase, GraduationCap, 
  Users, MessageCircle, Shield, Activity, Stethoscope, 
  BookOpen, Calculator, Palette, Music, TreePine, 
  Target, Zap, Smile, Settings, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const availableIcons = [
  { name: 'User', component: User },
  { name: 'Heart', component: Heart },
  { name: 'Brain', component: Brain },
  { name: 'Baby', component: Baby },
  { name: 'Briefcase', component: Briefcase },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Users', component: Users },
  { name: 'MessageCircle', component: MessageCircle },
  { name: 'Shield', component: Shield },
  { name: 'Activity', component: Activity },
  { name: 'Stethoscope', component: Stethoscope },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Calculator', component: Calculator },
  { name: 'Palette', component: Palette },
  { name: 'Music', component: Music },
  { name: 'TreePine', component: TreePine },
  { name: 'Target', component: Target },
  { name: 'Zap', component: Zap },
  { name: 'Smile', component: Smile },
  { name: 'Settings', component: Settings }
];

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = availableIcons.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar ícone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
        {filteredIcons.map((icon) => {
          const IconComponent = icon.component;
          return (
            <Button
              key={icon.name}
              variant={selectedIcon === icon.name ? "default" : "outline"}
              size="sm"
              onClick={() => onIconSelect(icon.name)}
              className="h-12 w-12 p-2"
            >
              <IconComponent className="h-5 w-5" />
            </Button>
          );
        })}
      </div>
      
      <div className="text-sm text-gray-600">
        Ícone selecionado: <span className="font-medium">{selectedIcon}</span>
      </div>
    </div>
  );
};
