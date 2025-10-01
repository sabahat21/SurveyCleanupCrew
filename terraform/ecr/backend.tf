terraform { 
  cloud { 
    
    organization = "sanskrit-survey-site" 

    workspaces { 
      name = "elastic-container-repository" 
    } 
  } 
}
