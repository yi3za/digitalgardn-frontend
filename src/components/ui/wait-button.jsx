import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

/**
 * Hook personnalise pour gerer un compte a rebours simple
 *
 * initialTime - Le temps de depart en secondes
 */
const useWait = (initialTime = 5) => {
  const [count, setCount] = useState(initialTime);
  const [countIsFinished, setCountIsFinished] = useState(false);

  useEffect(() => {
    // Si le compteur atteint zero, on arrete et on change l'etat
    if (count <= 0) {
      setCountIsFinished(true);
      return;
    }
    // Creation d'un intervalle d'une seconde (1000ms)
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    // Nettoyage de l'intervalle
    return () => clearInterval(timer);
  }, [count]); // Depend de 'count' pour se declencher a chaque seconde
  // Retourner les valeurs necessaires pour le composant UI
  return [count, countIsFinished];
};

export function WaitButton({ time = 5, children, ...props }) {
  const [count, countIsFinished] = useWait(time);

  return (
    <Button {...props} disabled={!countIsFinished || props.disabled}>
      {countIsFinished ? (
        children
      ) : (
        <>
          {children} ( {count} )
        </>
      )}
    </Button>
  );
}
