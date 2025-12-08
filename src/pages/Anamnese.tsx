import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, User, Heart, Clock, Camera, Loader2, Dumbbell } from "lucide-react";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import type { Json } from "@/integrations/supabase/types";

type Step = 1 | 2 | 3 | 4;

interface DadosPessoais {
  idade: string;
  peso: string;
  altura: string;
  objetivo: string;
}

interface HistoricoSaude {
  lesoes: string;
  restricoesAlimentares: string;
  medicamentos: string;
  condicoesMedicas: string[];
}

interface Rotina {
  diasDisponiveis: string[];
  horarioPreferido: string;
  duracaoTreino: string;
  nivelExperiencia: string;
  localTreino: string;
}

const objetivos = [
  "Perder peso",
  "Ganhar massa muscular",
  "Melhorar condicionamento",
  "Definição muscular",
  "Saúde geral",
];

const condicoesMedicasOptions = [
  "Diabetes",
  "Hipertensão",
  "Problemas cardíacos",
  "Problemas respiratórios",
  "Nenhuma",
];

const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const horarios = [
  "Manhã (6h-12h)",
  "Tarde (12h-18h)",
  "Noite (18h-22h)",
];

const duracoes = [
  "30 minutos",
  "45 minutos",
  "1 hora",
  "1h30",
];

const niveis = [
  "Iniciante",
  "Intermediário",
  "Avançado",
];

const locaisTreino = [
  "Academia",
  "Em casa",
  "Ao ar livre",
];

export default function Anamnese() {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    idade: "",
    peso: "",
    altura: "",
    objetivo: "",
  });

  const [historicoSaude, setHistoricoSaude] = useState<HistoricoSaude>({
    lesoes: "",
    restricoesAlimentares: "",
    medicamentos: "",
    condicoesMedicas: [],
  });

  const [rotina, setRotina] = useState<Rotina>({
    diasDisponiveis: [],
    horarioPreferido: "",
    duracaoTreino: "",
    nivelExperiencia: "",
    localTreino: "",
  });

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFotos = Array.from(files).slice(0, 3 - fotos.length);
    setFotos([...fotos, ...newFotos]);

    newFotos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
    setFotoPreviews(fotoPreviews.filter((_, i) => i !== index));
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!dadosPessoais.idade || !dadosPessoais.peso || !dadosPessoais.altura || !dadosPessoais.objetivo) {
          toast.error("Preencha todos os campos obrigatórios");
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        if (rotina.diasDisponiveis.length === 0 || !rotina.horarioPreferido || !rotina.nivelExperiencia) {
          toast.error("Selecione pelo menos um dia disponível, horário e nível");
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("anamnese").insert([{
        user_id: user.id,
        dados_pessoais: JSON.parse(JSON.stringify(dadosPessoais)) as Json,
        historico_saude: JSON.parse(JSON.stringify(historicoSaude)) as Json,
        rotina: JSON.parse(JSON.stringify(rotina)) as Json,
        status: "pendente",
      }]);

      if (error) throw error;

      // Simulate plan generation delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("Anamnese enviada! Seu plano está sendo gerado.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar anamnese:", error);
      toast.error("Erro ao salvar anamnese. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepIcons = [
    { icon: User, label: "Dados Pessoais" },
    { icon: Heart, label: "Histórico de Saúde" },
    { icon: Clock, label: "Rotina" },
    { icon: Camera, label: "Fotos" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <Dumbbell className="w-12 h-12 text-primary animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Criando seu plano personalizado...
          </h2>
          <p className="text-muted-foreground mb-6">
            Isso pode levar alguns minutos
          </p>
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Anamnese</h1>
          <div className="w-10" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 pb-4 px-4">
          {stepIcons.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep > index + 1
                    ? "bg-primary text-primary-foreground"
                    : currentStep === index + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < 3 && (
                <div
                  className={`w-8 h-1 mx-1 rounded transition-colors ${
                    currentStep > index + 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          {/* Step 1: Dados Pessoais */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Dados Pessoais</h2>
                <p className="text-muted-foreground text-sm">
                  Conte-nos um pouco sobre você
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="idade">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    placeholder="Ex: 25"
                    value={dadosPessoais.idade}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, idade: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                      id="peso"
                      type="number"
                      placeholder="Ex: 70"
                      value={dadosPessoais.peso}
                      onChange={(e) =>
                        setDadosPessoais({ ...dadosPessoais, peso: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="altura">Altura (cm) *</Label>
                    <Input
                      id="altura"
                      type="number"
                      placeholder="Ex: 175"
                      value={dadosPessoais.altura}
                      onChange={(e) =>
                        setDadosPessoais({ ...dadosPessoais, altura: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Qual seu principal objetivo? *</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {objetivos.map((objetivo) => (
                      <button
                        key={objetivo}
                        type="button"
                        onClick={() =>
                          setDadosPessoais({ ...dadosPessoais, objetivo })
                        }
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          dadosPessoais.objetivo === objetivo
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {objetivo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Histórico de Saúde */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Histórico de Saúde
                </h2>
                <p className="text-muted-foreground text-sm">
                  Informações importantes para sua segurança
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesoes">Possui alguma lesão ou limitação física?</Label>
                  <Textarea
                    id="lesoes"
                    placeholder="Descreva lesões anteriores ou atuais..."
                    value={historicoSaude.lesoes}
                    onChange={(e) =>
                      setHistoricoSaude({ ...historicoSaude, lesoes: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="restricoes">Restrições alimentares</Label>
                  <Textarea
                    id="restricoes"
                    placeholder="Alergias, intolerâncias, dietas específicas..."
                    value={historicoSaude.restricoesAlimentares}
                    onChange={(e) =>
                      setHistoricoSaude({
                        ...historicoSaude,
                        restricoesAlimentares: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="medicamentos">Medicamentos em uso</Label>
                  <Textarea
                    id="medicamentos"
                    placeholder="Liste os medicamentos que você toma..."
                    value={historicoSaude.medicamentos}
                    onChange={(e) =>
                      setHistoricoSaude({
                        ...historicoSaude,
                        medicamentos: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Condições médicas</Label>
                  <div className="space-y-2 mt-2">
                    {condicoesMedicasOptions.map((condicao) => (
                      <div key={condicao} className="flex items-center space-x-3">
                        <Checkbox
                          id={condicao}
                          checked={historicoSaude.condicoesMedicas.includes(condicao)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setHistoricoSaude({
                                ...historicoSaude,
                                condicoesMedicas: [
                                  ...historicoSaude.condicoesMedicas,
                                  condicao,
                                ],
                              });
                            } else {
                              setHistoricoSaude({
                                ...historicoSaude,
                                condicoesMedicas: historicoSaude.condicoesMedicas.filter(
                                  (c) => c !== condicao
                                ),
                              });
                            }
                          }}
                        />
                        <label htmlFor={condicao} className="text-sm text-foreground">
                          {condicao}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Rotina */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Sua Rotina</h2>
                <p className="text-muted-foreground text-sm">
                  Personalizaremos seu plano com base na sua disponibilidade
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Dias disponíveis para treinar *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {diasSemana.map((dia) => (
                      <button
                        key={dia}
                        type="button"
                        onClick={() => {
                          if (rotina.diasDisponiveis.includes(dia)) {
                            setRotina({
                              ...rotina,
                              diasDisponiveis: rotina.diasDisponiveis.filter(
                                (d) => d !== dia
                              ),
                            });
                          } else {
                            setRotina({
                              ...rotina,
                              diasDisponiveis: [...rotina.diasDisponiveis, dia],
                            });
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          rotina.diasDisponiveis.includes(dia)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {dia.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Horário preferido *</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {horarios.map((horario) => (
                      <button
                        key={horario}
                        type="button"
                        onClick={() => setRotina({ ...rotina, horarioPreferido: horario })}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          rotina.horarioPreferido === horario
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Duração do treino</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {duracoes.map((duracao) => (
                      <button
                        key={duracao}
                        type="button"
                        onClick={() => setRotina({ ...rotina, duracaoTreino: duracao })}
                        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                          rotina.duracaoTreino === duracao
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {duracao}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Nível de experiência *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {niveis.map((nivel) => (
                      <button
                        key={nivel}
                        type="button"
                        onClick={() => setRotina({ ...rotina, nivelExperiencia: nivel })}
                        className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                          rotina.nivelExperiencia === nivel
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {nivel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Onde você vai treinar?</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {locaisTreino.map((local) => (
                      <button
                        key={local}
                        type="button"
                        onClick={() => setRotina({ ...rotina, localTreino: local })}
                        className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                          rotina.localTreino === local
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {local}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Fotos */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Fotos Iniciais</h2>
                <p className="text-muted-foreground text-sm">
                  Tire fotos de 3 ângulos para acompanhar sua evolução
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Frente", "Lado", "Costas"].map((angulo, index) => (
                  <div key={angulo} className="text-center">
                    <div
                      className={`aspect-[3/4] rounded-xl border-2 border-dashed overflow-hidden ${
                        fotoPreviews[index]
                          ? "border-primary"
                          : "border-border bg-muted/50"
                      }`}
                    >
                      {fotoPreviews[index] ? (
                        <div className="relative h-full">
                          <img
                            src={fotoPreviews[index]}
                            alt={angulo}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFoto(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="h-full flex flex-col items-center justify-center cursor-pointer p-2">
                          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">
                            {angulo}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFotoUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-medium text-foreground mb-2">Dicas para as fotos:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use roupas justas ou de praia</li>
                  <li>• Boa iluminação natural</li>
                  <li>• Mantenha a mesma postura</li>
                  <li>• Fundo neutro</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={nextStep} className="flex-1">
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1">
              <Dumbbell className="w-4 h-4 mr-2" />
              Gerar Meu Plano
            </Button>
          )}
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </div>
  );
}
