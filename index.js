#!/usr/bin/env node

const axios = require("axios");

process.argv.slice(2).forEach(async(user) => {
    
    // //Récupère la liste des repos
    const repos = getRepos(user);
    
    // //Pour chaque repo, on récupère les infos de languages
    const languages = getLanguages(repos);

    // //On résume les languages dans un seul objet result
    const result = sumLanguages(languages);

    //Log l'output
    console.log(`Language repartition for ${user}`);
    Object.keys(result).forEach(language => {
        console.log(`* ${result[language]}: ${language}`);
    });
});


const getRepos = async(user) => {
    const repoListUrl = `https://api.github.com/users/${user}/repos`;
    await axios.get(repoListUrl, { headers: { Accept: "application/json" }})
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err));
} 

const getLanguages = async(repos) => {
    let languages = [];
    repos.forEach(async(repo) => {
        const repoLanguageUrl = `https://api.github.com/repos/${user}/${repo.name}/languages`;
        await axios.get(repoLanguageUrl, { headers: { Accept: "application/json" }})
            .then(response => {
                languages.push(response.data);
            }).catch(err => console.log(err));
    });

    return languages;
}

const sumLanguages = async(languages) => {
    let result = {};
    languages.forEach(entry => {
        Object.keys(entry).forEach(language => {
            let lines = entry[language];
            if(!result[language]) {
                result[language] = lines;
            } else {
                result[language] += lines;
            }
        });
    });
    return result;
}