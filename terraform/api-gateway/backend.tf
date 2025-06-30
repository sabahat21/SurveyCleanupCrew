terraform { 
  cloud { 
    
    organization = "sanskrit-survey-site" 

    workspaces { 
      name = "api-gateway" 
    } 
  } 
}
