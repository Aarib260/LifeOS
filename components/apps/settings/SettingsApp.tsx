"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardHover } from "@/lib/appRegistry";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className, onClick }: CardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      onClick={onClick}
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6",
        "hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:shadow-xl",
        "transition-colors duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}


{

      "id": "brazil",

          "name": "Brazil",

              "officialName": "Federative Republic of Brazil",

                  "capital": "Brasília",

                      "population": 216000000,

                          "area": 8515767,

                              "continent": "South America",

                                  "region": "South America",

                                      "languages": ["Portuguese"],

                                          "currency": { "name": "Brazilian Real", "code": "BRL", "symbol": "R$" },

                                              "timezone": "UTC-3",

                                                  "flag": "/flags/brazil.png",

                                                      "heroImage": "/images/brazil/hero.jpg",

                                                          "gallery": [

                                                                  "/images/brazil/gallery-1.jpg",

                                                                        "/images/brazil/gallery-2.jpg",

                                                                              "/images/brazil/gallery-3.jpg",

                                                                                    "/images/brazil/gallery-4.jpg"

                                                          ],

                                                              "coordinates": { "lat": -14.235, "lng": -51.9253 },

                                                                  "landmarks": [

                                                                          {

                                                                                    "name": "Christ the Redeemer",

                                                                                            "image": "/images/brazil/landmark-christ.jpg",

                                                                                                    "description": "A towering statue of Jesus Christ overlooking Rio de Janeiro from Corcovado mountain."

                                                                          },

                                                                                {

                                                                                          "name": "Iguazu Falls",

                                                                                                  "image": "/images/brazil/landmark-iguazu.jpg",

                                                                                                          "description": "A spectacular system of waterfalls on the border with Argentina, among the largest in the world."

                                                                                },

                                                                                      {

                                                                                                "name": "Amazon Rainforest",

                                                                                                        "image": "/images/brazil/landmark-amazon.jpg",

                                                                                                                "description": "The world's largest tropical rainforest, home to unparalleled biodiversity."

                                                                                      }

                                                                                    ],

                                                                                        "food": [

                                                                                                {

                                                                                                          "name": "Feijoada",

                                                                                                                  "image": "/images/brazil/food-feijoada.jpg",

                                                                                                                          "description": "A rich black bean stew with pork, considered Brazil's national dish."

                                                                                                },

                                                                                                      {

                                                                                                                "name": "Pão de Queijo",

                                                                                                                        "image": "/images/brazil/food-paodequeijo.jpg",

                                                                                                                                "description": "Small, chewy cheese bread rolls made with cassava flour."

                                                                                                      }

                                                                                                    ],

                                                                                                        "nationalAnimal": {

                                                                                                                "name": "Jaguar",

                                                                                                                      "image": "/images/brazil/animal-jaguar.jpg",

                                                                                                                            "description": "A powerful big cat found throughout the Amazon, symbolizing Brazil's wild biodiversity."

                                                                                                        },

                                                                                                            "description": "A vast, vibrant nation of rainforests, beaches, and carnival spirit, blending indigenous, African, and Ea",

                                                                                                                "region": "North Africa",

                                                                                                                    "languages": ["Arabic"],

                                                                                                                        "currency": { "name": "Egyptian Pound", "code": "EGP", "symbol": "£" },

                                                                                                                            "timezone": "UTC+2",

                                                                                                                                "flag": "/flags/egypt.png",

                                                                                                                                    "heroImage": "/images/egypt/hero.jpg",

                                                                                                                                        "gallery": [

                                                                                                                                                "/images/egypt/gallery-1.jpg",

                                                                                                                                                      "/images/egypt/gallery-2.jpg",

                                                                                                                                                            "/images/egypt/gallery-3.jpg",

                                                                                                                                                                  "/images/egypt/gallery-4.jpg"

                                                                                                                                        ],

                                                                                                                                            "coordinates": { "lat": 26.8206, "lng": 30.8025 },

                                                                                                                                                "landmarks": [

                                                                                                                                                        {

                                                                                                                                                                  "name": "Great Pyramid of Giza",

                                                                                                                                                                          "image": "/images/egypt/landmark-pyramid.jpg",

                                                                                                                                                                                  "description": "The oldest of the Seven Wonders of the Ancient World, built as a tomb for Pharaoh Khufu."

                                                                                                                                                        },

                                                                                                                                                              {

                                                                                                                                                                        "name": "The Sphinx",

                                                                                                                                                                                "image": "/images/egypt/landmark-sphinx.jpg",

                                                                                                                                                                                        "description": "A massive limestone statue with the body of a lion and the head of a pharaoh, guarding the Giza plateau."

                                                                                                                                                              },

                                                                                                                                                                    {

                                                                                                                                                                              "name": "Abu Simbel",

                                                                                                                                                                                      "image": "/images/egypt/landmark-abusimbel.jpg",

                                                                                                                                                                                              "description": "Two massive rock temples carved during the reign of Ramesses II in southern Egypt."

                                                                                                                                                                    }

                                                                                                                                                                  ],

                                                                                                                                                                      "food": [

                                                                                                                                                                              {

                                                                                                                                                                                        "name": "Koshari",

                                                                                                                                                                                                "image": "/images/egypt/food-koshari.jpg",

                                                                                                                                                                                                        "description": "A hearty mix of rice, lentils, pasta, and chickpeas topped with tomato sauce and crispy onions."

                                                                                                                                                                              },

                                                                                                                                                                                    {

                                                                                                                                                                                              "name": "Ful Medames",

                                                                                                                                                                                                      "image": "/images/egypt/food-fulmedames.jpg",

                                                                                                                                                                                                              "description": "Slow-cooked fava beans seasoned with olive oil, lemon, and garlic, a breakfast staple."

                                                                                                                                                                                    }

                                                                                                                                                                                  ],

                                                                                                                                                                                      "nationalAnimal": {

                                                                                                                                                                                              "name": "Egyptian Plover",

                                                                                                                                                                                                    "image": "/images/egypt/animal-plover.jpg",

                                                                                                                                                                                                          "description": "A striking bird historically associated with ancient Egyptian mythology and Nile ecosystems."

                                                                                                                                                                                      },

                                                                                                                                                                                          "description": "The cradle of one of history's greatest civilizations, home to ancient pyramids, temples, and the timeless Nile River.",

                                                                                                                                                                                              "funFacts": [

                                                                                                                                                                                                      "Egypt is home to the only surviving Wonder of the Ancient World.",

                                                                                                                                                                                                            "The Nile is the l"
                                                                                                                                                                                              ]
                                                                                                                                                                                      }
                                                                                                                                                                                    }
                                                                                                                                                                              }
                                                                                                                                                                      ]
                                                                                                                                                                    }
                                                                                                                                                              }
                                                                                                                                                        }
                                                                                                                                                ]
                                                                                                                                        ]
                                                                                                        }
                                                                                                      }
                                                                                                }
                                                                                        ]
                                                                                      }
                                                                                }
                                                                          }
                                                                  ]
                                                          ]
}