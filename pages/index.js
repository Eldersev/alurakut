
import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import ProfileRelationsBoxWrapper from '../src/components/ProfileRelations'
import {AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault} from '../src/lib/AlurakutCommons'

function ProfileSidebar (propriedades) {
  return (
    <Box as ="aside">  
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}/>
      <hr />
      <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}> @{propriedades.githubUser} </a>
      <hr /> 
      <AlurakutProfileSidebarMenuDefault/>
    </Box >
  )
}


function ProfileRelationsBox (propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
      {propriedades.title} ({propriedades.items.length})
      </h2>
      
      <ul>
        {propriedades.items.slice(0,6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.url} >
                <img src={itemAtual.image}/>
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  
  const githubUser = 'eldersev';
  const pessoasfavoritas = ['juunegreiros','omariosouto','peas','rafaballerini','marcobrunodev','felipefialho']
  // const [comunidades, setComunidades] = React.useState([{
  //   id: '6546504564',
  //   title: 'Eu odeio acordar cedo',              
  //   image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  // }]);

  const [seguidores, setSeguidores] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);

  //Seguidores
  React.useEffect(function(){
    fetch('https://api.github.com/users/peas/followers')
    .then(function(serverResponse) {
      return serverResponse.json();
    })
    .then(function(response){
      
      let items = []
      response.map((itemAtual) => {
        const item={
          id: itemAtual.avatar_url,
          image: itemAtual.avatar_url,
          title: itemAtual.login,
          url: itemAtual.html_url,
        }
        items = [...items,item];
      })
      setSeguidores(items);
      
    })
  },[])

  // Comunidades
  const tokenDatoCMS = "f7f8d7345183085c25c0c05efe7091";
  React.useEffect(function(){
    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenDatoCMS}`,
        },
        body: JSON.stringify({
          query: `{
                  allCommunities {
                    id
                    title
                    imageUrl
                    _status
                    _firstPublishedAt
                  }
                  _allCommunitiesMeta {
                    count
                  }
                }`
        }),
      }
    )
    .then(res => res.json())
    .then((res) => {
      // console.log(res.data);
      // console.log(res.data.allCommunities);
      const communities  = res.data.allCommunities
      let items = [];
      communities.map((itemAtual) => {
        const item={
          id: itemAtual.id,
          image: itemAtual.imageUrl,
          title: itemAtual.title,
          url: itemAtual.imageUrl,
        }
        items = [...items,item];
        
      })
      setComunidades(items);

    })
    .catch((error) => {
      console.log(error);
    });
  },[])


/*
  const [listaPessoasfavoritas, setlistaPessoasfavoritas] = React.useState([
    {id: new Date().toISOString(),
     title: 'juunegreiros',              
     image: 'https://github.com/juunegreiros.png',
    },
    {id: new Date().toISOString(),
     title: 'omariosouto',              
     image: 'https://github.com/omariosouto.png',
    },
    {id: new Date().toISOString(),
      title: 'peas',              
      image: 'https://github.com/peas.png',
     },
     {id: new Date().toISOString(),
      title: 'rafaballerini',              
      image: 'https://github.com/rafaballerini.png',
     },
     {id: new Date().toISOString(),
      title: 'marcobrunodev',              
      image: 'https://github.com/marcobrunodev.png',
     },
     {id: new Date().toISOString(),
      title: 'felipefialho',              
      image: 'https://github.com/felipefialho.png',
     }
  ]);
*/

  return ( 
  <>   
  <AlurakutMenu githubUser={githubUser}/>
  <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="Title">
            Bem vindo(a)
          </h1>
          <OrkutNostalgicIconSet />
        </Box>

        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>

          <form onSubmit={ function handleCriaComunidade(e) {
            e.preventDefault();
            const dadosForm = new FormData(e.target);

            const comunidade ={
              id: new Date().toISOString(),
              title: dadosForm.get('title'),              
              image: dadosForm.get('image'),
            }
            const comunidadesAtualizadas = [...comunidades, comunidade];
            setComunidades(comunidadesAtualizadas);

          }} >
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?" 
                type="text"
              />              
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa" 
                type="text"
              />              
            </div>
            <button>
              Criar Comunidade
            </button>
          </form>
        </Box>
      </div>

      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        {/* <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidade ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`} key={itemAtual.title} >
                      <img src={itemAtual.image}/>
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
        </ProfileRelationsBoxWrapper> */}
          
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          Pessoas da Comunidade ({pessoasfavoritas.length})
          </h2>

          
          <ul>
            {pessoasfavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`} key={itemAtual} >
                    <img src={`https://github.com/${itemAtual}.png`}/>
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

        <ProfileRelationsBox title="Comunidades" items={comunidades}/>
        <ProfileRelationsBox title="Seguidores" items={seguidores}/>
 

        {/* <BoxLista title="Comunidades" lista={comunidades}/>
        <BoxLista title="Pessoas da Comunidade" lista={listaPessoasfavoritas}/> */}
        
      </div>
  </MainGrid>
  </>
  )
  

}
