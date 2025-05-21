import { defineStore } from "pinia";
import { ref } from "vue";

export const useVisitCounterStore = defineStore("visitCounter", () => {
  const visitCount = ref(0);
  const hasVisited = ref(false);

  if (typeof window !== "undefined") {
    try {
      const savedCount = localStorage.getItem("visitCount");
      const savedVisitFlag = localStorage.getItem("hasVisited");

      visitCount.value = savedCount ? parseInt(savedCount) : 0;
      hasVisited.value = savedVisitFlag === "true";
    } catch (error) {
      console.error("Error odczytywania danych:", error);
      visitCount.value = 0;
      hasVisited.value = false;
    }
  }

  const increment = () => {
    if (!hasVisited.value) {
      visitCount.value++;
      hasVisited.value = true;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("visitCount", visitCount.value.toString());
          localStorage.setItem("hasVisited", "true");
        } catch (error) {
          console.error("Error zapisywania danych:", error);
        }
      }
    }
  };

  return {
    visitCount,
    increment,
  };
});
